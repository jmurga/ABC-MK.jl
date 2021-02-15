"""
	parseSfs(;data,output,sfsColumns,divColumns)

Function to parse polymorphism and divergence by subset of genes. The input data is based on supplementary material described at [Uricchio et al. 2019](https://doi.org/10.1038/s41559-019-0890-6). Please be sure the file is tabulated.

| GeneId | Pn | DAF seppareted by commas | Ps | DAF separated by commas | Dn | Ds |
|--------|----|--------------------------|----|-------------------------|----|----|
| XXXX   | 0  | ,0,0,0,0,0,0,0,0         | 0  | ,0,0,0,0,0,0,0,0        | 0  | 0  |
| XXXX   | 0  | ,0,0,0,0,0,0,0,0         | 0  | ,0,0,0,0,0,0,0,0        | 0  | 0  |
| XXXX   | 0  | ,0,0,0,0,0,0,0,0         | 0  | ,0,0,0,0,0,0,0,0        | 0  | 0  |

# Arguments
 - `data`: String or Array of strings containing files names with full path.
 - `output::String`: path to save file. Containing one file per input file.
 - `sfsColumns::Array{Int64,1}`: non-synonymous and synonymous daf columns. Please introduce first the non-synonymous number.
 - `divColumns::Array{Int64,1}`: non-synonymous and synonymous divergence columns. Please introduce first the non-synonymous number.

# Returns
 - `Array{Array{Int64,N} where N,1}`: Array of arrays containing the total polymorphic sites (1), total Site Frequency Spectrum (2) and total divergence (3). Each array contains one row/column per file.
 - File writed in `output`
"""
function parseSfs(;sample::Int64,data::String,sfsColumns::Array{Int64,1}=[3,5],divColumns::Array{Int64,1}=[6,7],dac::Array{Int64,1},B::Union{Nothing,Float64}=nothing,bins::Union{Nothing,Int64}=nothing)

	g(x) = parse.(Float64,x[2:end-1])
	
	s = (sample*2)
	freq = OrderedDict(round.(collect(1:(s-1))/s,digits=4) .=> 0)

	df   = CSV.read(data,header=false,delim='\t',DataFrame)
	#=df   = filter([:Column2, :Column4] => (x, y) -> x > 0 || y > 0 , df)=#
	

	if(!isnothing(B))
		df = df[df[:,end] .== B,:]
		println(nrow(df))
		tmp  = split.(df[:,sfsColumns], ",")
	else
		tmp  = split.(df[:,sfsColumns], ",")
	end

	pn   = sort!(OrderedDict(round.(reduce(vcat,tmp[:,1] .|> g),digits=4) |> StatsBase.countmap))
	ps   = sort!(OrderedDict(round.(reduce(vcat,tmp[:,2] .|> g),digits=4) |> StatsBase.countmap))

	# Dn, Ds, Pn, Ps, sfs
	Dn           = sum(df[:,divColumns[1]])
	Ds           = sum(df[:,divColumns[2]])
	Pn           = sum(values(pn))
	Ps           = sum(values(ps))
	sfsPn        = cumulativeSfs(reduce(vcat,values(merge(+,freq,pn))))
	sfsPs        = (cumulativeSfs(reduce(vcat,values(merge(+,freq,ps)))))

	if(!isnothing(bins))
		sfsPn = reduceSfs(hcat(collect(1:(s-1)),sfsPn),40)[:,2]
		sfsPs = reduceSfs(hcat(collect(1:(s-1)),sfsPs),40)[:,2]

		sfs = reduceSfs(hcat(freq.keys,merge(+,freq,pn).vals,merge(+,freq,ps).vals),bins)
	else
		sfs = hcat(freq.keys,merge(+,freq,pn).vals,merge(+,freq,ps).vals)
	end
	α            = round.(1 .- Ds/Dn .*  sfsPn ./sfsPs,digits=5)[dac]

	D = [Dn+Ds]
	cSfs = sfsPn+sfsPs

	return (α,cSfs,D,sfs,[Dn,Ds])
end
"""
	ABCreg(data, prior, nparams, nsummaries, outputPath, outputPrefix,tolerance, regressionMode,regPath)

Julia to execute *ABCreg*. You should take into account that any other ABC could be used once the prior distributions are done. If you consider to use ABCreg please [cite the publication](https://doi.org/10.1186/1471-2156-10-35) and compile it in your system.

# Arguments
 - `data::String`: Observed data. Produced by parseSfs.
 - `output::String`: path to save file. ABCreg will produce one file per lines inside data.
 - `nparams::Int64`: number of parameters in prior distributions.
 - `nsummaries::Int64`: number of observed summary statistics.
 - `outputPath::String`: output path.
 - `outputPrefix::String`: output prefix name.
 - `tolerance::Float64`: tolerance for rejection acceptance in Euclidian distance.
 - `regressionMode::String`: transformation (T or L).
# Returns
 - `Array{Array{Int64,N} where N,1}`: Array of arrays containing the total polymorphic sites (1), total Site Frequency Spectrum (2) and total divergence (3). Each array contains one row/column per file.
 - File writed in `output`
 -
"""
function ABCreg(;data::String, prior::String, nparams::Int64, nsummaries::Int64, outputPath::String, outputPrefix::String,tolerance::Float64, regressionMode::String,regPath="/home/jmurga/ABCreg/src/reg")

	reg = `$regPath -p $prior -d $data -P $nparams -S $nsummaries -b $outputPath$outputPrefix -$regressionMode -t $tolerance`
	run(reg)

	openFiles(f) = convert(Matrix,read(open(f),header=false))
	files = outputPath .* filter(x -> occursin(outputPrefix,x), readdir(outputPath))

	posteriors = openFiles.(files)
	estimates  = meanQ.(posteriors)

	return posteriors,estimates
end

"""
	meanQ(x,columns)

Function to retrieve mean and quantiles (95%) from posterior distributions.

# Arguments
 - `x::Array{Float64,2}`: posterior distribution.
 - `columns::Array{Int64,1}`: columns to process.
# Returns
 - `Array{Array{Float64,2},1}`: Array of array containing mean and quantiles by posterior distribution. Each array contains ```\$\\alpha_{S}\$```, ```\$\\alpha_{W}\$``` and ```\$\\alpha\$``` information by column.
"""
function meanQ(x::Array{Float64,2})

	m            = StatsBase.mean(x,dims=1)
	qt           = Array{Float64}(undef,size(x,2),2)
	for i in 1   : size(x,2)
		qt[i,: ] = StatsBase.quantile(x[:,i],[0.05,0.95])
	end

	return vcat(m,permutedims(qt))
end

function openSfsDiv(x,y,dac,h=false,bootstrap=false)

	sfs = CSV.read(x,header=h,DataFrame) |> Array

	if bootstrap
		sfs[:,2:end] = PoissonRandom.pois_rand.(sfs[:,2:end])
	end

	scumu = Analytical.cumulativeSfs(sfs)
	s = sum(scumu[:,2:3],dims=2)[dac]
	divergence = CSV.read(y,DataFrame,header=h) |> Array
	d = [sum(divergence[1:2])]
	α = @. 1 - (divergence[2]/divergence[1] * scumu[:,2]/scumu[:,3])[dac]
	α = round.(α,digits=5)
	return(s,d,α)	
end

function bootstrapData(sFile::Array{Float64,2},dFile::Array{Float64,2},replicas::Int64,outputFolder::String)
	
	# Open Data
	sfs        = Array(CSV.read(sFile,DataFrame))
	divergence = fill(Array(CSV.read(dFile,DataFrame)),replicas)
	scumu      = fill(cumulativeSfs(sfs[:,2:end]),replicas)

	# Bootstraping
	b(x)       = PoissonRandom.pois_rand.(x)
	bootstrap  = b.(scumu)

	# Output
	outSfs = @. output * "sfs" * string(1:replicas) * ".tsv"
	outDiv = @. output * "div" * string(1:replicas) * ".tsv"
	for i  = 1:replicas
		tmp = hcat(sfs[:,1],bootstrap[i])
		CSV.write(out,DataFrame(tmp),header=false)
		CSV.write(out,DataFrame(divergence[i]),header=false)
	end
end
