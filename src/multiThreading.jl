"""
	summStats(param::parameters,iterations::Int64,divergence::Array,sfs::Array)

Function to solve randomly *N* scenarios

# Arguments
 - `param::parameters`
 - `iterations::Int64`
 - `divergence::Array`
 - `sfs::Array`
# Returns
 - `Array`: summary statistics
"""
function summaryStats(;param::parameters,gH::Array{Int64,1},gL::Array{Int64,1},shape::Float64=0.184,scale::Float64=0.000402,divergence::Array,sfs::Array,iterations::Int64,fixed::Bool=false)

	# iterations  = trunc(Int,iterations/19) + 1
	# N random prior combinations
	# fac         = rand(-2:0.1:2,iterations,2)

	if fixed == true
		afac = fill(shape,iterations)
		bfac = fill(scale,iterations)
	else
		fac  = rand(-2:0.05:2,iterations,2)
		afac = @. shape*(2^fac[:,1]) 
		bfac = @. scale*(2^fac[:,2])
	end

	lfac = rand(0.05:0.05:0.9,iterations)
	nTot = rand(0.1:0.01:0.9,iterations)

	nLow       = @. nTot * lfac
	nParam      = [param for i in 1:iterations];
	ndivergence = [divergence for i in 1:iterations];
	nSfs        = [sfs for i in 1:iterations];
	nDac        = [param.dac for i in 1:iterations];
	ngh = rand(repeat(gH,iterations),iterations);
	ngl = rand(repeat(gL,iterations),iterations);

	# Estimations to thread pool

	#=out = SharedArray{Float64,3}(size(param.bRange,2),(3+size(dac,1)),iterations*size(param.bRange,2))=#
	out = SharedArray{Float64,3}(size(param.bRange,2),size(param.dac,1)+3,iterations);
	@sync @distributed for i in eachindex(afac)
		tmp = bgsIter(param = nParam[i],alTot = nTot[i], alLow = nLow[i],gH=ngh[i],gL=ngl[i],afac=afac[i],bfac=bfac[i],divergence=ndivergence[i],sfs=nSfs[i]);
		out[:,:,i] = tmp;
	end

	df = vcat(eachslice(out,dims=3)...);

	return df
end

function ratesToStats(;param::parameters,convolutedSamples::binomialDict,gH::Array{Int64,1},gL::Array{Int64,1},gamNeg::Array{Int64,1},shape::Float64=0.184,iterations::Int64,output::String)

	fac    = rand(-2:0.05:2,iterations,2)
	afac   = @. param.al*(2^fac[:,1])
	#=bfac   = @. (param.al/param.be)*(2^fac[:,2])=#

	lfac   = rand(0.05:0.05:0.9,iterations)
	nTot   = rand(0.1:0.01:0.9,iterations)

	nLow   = @. nTot * lfac
	nParam = [param for i in 1:iterations];
	nBinom = [convolutedSamples for i in 1:iterations];
	ngh    = rand(repeat(gH,iterations),iterations);
	ngl    = rand(repeat(gL,iterations),iterations);
	ngamNeg    = rand(repeat(gamNeg,iterations),iterations);
	
	# Estimations to thread pool
	out    = SharedArray{Float64,3}(size(param.bRange,2),(size(param.dac,1) *2) + 15,iterations)
	@time @sync @distributed for i in eachindex(afac)
		@inbounds out[:,:,i] = iterRates(param = nParam[i],convolutedSamples=nBinom[i],alTot = nTot[i], alLow = nLow[i],gH=ngh[i],gL=ngl[i],gamNeg=ngamNeg[i],afac=afac[i]);
	end

	df = vcat(eachslice(out,dims=3)...);
	models = DataFrame(df[:,1:8],[Symbol("B"),Symbol("alLow"),Symbol("alTot"),Symbol("gamNeg"),Symbol("gL"),Symbol("gH"),Symbol("al"),Symbol("be")])

    neut   = df[:,9:8+size(param.dac,1)]
    sel    = df[:,9+size(param.dac,1):8+size(param.dac,1)*2]
    neut   = df[:,9:8+size(param.dac,1)]
    sel    = df[:,9+size(param.dac,1):8+size(param.dac,1)*2]
    dsdn   = df[:,end-6:end-3]
    alphas = DataFrame(df[:,end-2:end],[Symbol("αW"),Symbol("αS"),Symbol("α")])

	#=neutSymbol = [Symbol("neut"*string(i)) for i in 1:size(param.dac,1)]
	selSymbol = [Symbol("sel"*string(i)) for i in 1:size(param.dac,1)]=#
	#=DataFrames.rename!(df,vcat([Symbol("B"),Symbol("alLow"),Symbol("alTot"),Symbol("gamNeg"),Symbol("gL"),Symbol("gH"),Symbol("al"),Symbol("be"),neutSymbol,selSymbol,Symbol("ds"),Symbol("dn"),Symbol("dweak"),Symbol("dstrong"),Symbol("αW"),Symbol("αS"),Symbol("α")]...))=#


	JLD2.jldopen(output, "a+") do file
        file[string(param.N)* "/" * string(param.n) * "/models"] = models
        file[string(param.N)* "/" * string(param.n) * "/neut"]   = neut
        file[string(param.N)* "/" * string(param.n) * "/sel"]    = sel
        file[string(param.N)* "/" * string(param.n) * "/dsdn"]   = dsdn
        file[string(param.N)* "/" * string(param.n) * "/alphas"] = alphas
        file[string(param.N)* "/" * string(param.n) * "/dac"]    = param.dac
	end

	return df
end

"""
	bgsIter(param::parameters,afac::Float64,bfac::Float64,alTot::Float64,alLow::Float64,divergence::Array,sfs::Array)

Function to input and solve one scenario given *N* background selection values (*B*). It is used at *summStats* function to solve all the scenarios in multi-threading. Please use *Distributed* module to add *N* threads using *addprocs(N)*. In addition you must to declare our module in all the threads using the macro *@everywhere* before to start. Check the example if don't know how to do it.

# Arguments
 - `param::parameters`
 - `iterations::Int64`
 - `divergence::Array`
 - `sfs::Array`
# Returns
 - `Array`: summary statistics
"""
function bgsIter(;param::parameters,alTot::Float64,alLow::Float64,gH::Int64,gL=Int64,afac::Float64,bfac::Float64,divergence::Array,sfs::Array)

	# Matrix and values to solve
	dm 			= size(divergence,1)
	param.al    = afac; param.be = bfac;
	param.alLow = alLow; param.alTot = alTot;
	param.gH = gH;param.gL = gL
	# Solve probabilites without B effect to achieve α value
	param.B = 0.999
	setThetaF!(param)
	setPpos!(param)

	r = zeros(size(param.bRange,2) * dm,size(param.dac,1) + 3)
	for j in eachindex(param.bRange)
		param.B = param.bRange[j]
		# Solve mutation given a new B value.
		setThetaF!(param)
		# Solven given same probabilites probabilites ≠ bgs mutation rate.
		#x,y,z::Array{Float64,2} = alphaByFrequencies(param,divergence,sfs,dac)
		x,y,z = alphaByFrequencies(param,divergence,sfs)
		r[j,:] = z
	end

	return r
end


function iterRates(;param::parameters,convolutedSamples::binomialDict,alTot::Float64,alLow::Float64,gH::Int64,gL=Int64,gamNeg::Int64,afac::Float64)

	# Matrix and values to solve
	dm 			= 1
	param.al    = afac; param.be = abs(afac/gamNeg);
	param.alLow = alLow; param.alTot = alTot;
	param.gH = gH;param.gL = gL; param.gamNeg = gamNeg

	# Solve probabilites without B effect to achieve α value
	param.B = 0.999
	setThetaF!(param)
	setPpos!(param)

	r = zeros(size(param.bRange,2) * dm,(size(param.dac,1) * 2) + 15)
	for j in eachindex(param.bRange)
		param.B = param.bRange[j]
		# Solve mutation given a new B value.
		setThetaF!(param)
		# Solven given same probabilites probabilites ≠ bgs mutation rate.
		#x,y,z::Array{Float64,2} = alphaByFrequencies(param,divergence,sfs,dac)
		@inbounds r[j,:] = gettingRates(param,convolutedSamples)
	end

	return r
end
