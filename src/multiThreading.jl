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
function summaryStats(;param::parameters,amk::Float64,gH::Array{Int64,1},gL::Array{Int64,1},shape::Float64=0.184,scale::Float64=0.000402,divergence::Array,sfs::Array,dac::Array{Int64,1},iterations::Int64,fixed::Bool=false)

	# iterations  = trunc(Int,iterations/19) + 1
	# N random prior combinations
	# fac         = rand(-2:0.1:2,iterations,2)
	alpha = round(amk,digits=1)

	if fixed == true
		afac = fill(shape,iterations)
		bfac = fill(scale,iterations)
	else
		fac  = rand(-2:0.5:2,iterations,2)
		afac = @. shape*(2^fac[:,1]) 
		bfac = @. scale*(2^fac[:,2])
	end

	lfac = rand(0.1:0.05:0.9,iterations)
	nTot = rand(0.0:0.01:0.9,iterations)

	nLow       = @. nTot * lfac
	nParam      = [param for i in 1:iterations]
	ndivergence = [divergence for i in 1:iterations]
	nSfs        = [sfs for i in 1:iterations]
	nDac        = [dac for i in 1:iterations]
	ngh = rand(repeat(gH,iterations),iterations)
	ngl = rand(repeat(gL,iterations),iterations)
	# Estimations to thread pool

	out = SharedArray{Float64,3}((iterations,size(param.bRange,2),(3+size(dac,1))))
	@sync @distributed for i in eachindex(afac)
		tmp = bgsIter(param = nParam[i],alTot = nTot[i], alLow = nLow[i],gH=ngh[i],gL=ngl[i],afac=afac[i],bfac=bfac[i],divergence=ndivergence[i],sfs=nSfs[i],dac=nDac[i])
		out[i,:,:] = tmp
	end

	# Output
	df = reshape(out,iterations*size(param.bRange,2), (3+size(dac,1)))
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
function bgsIter(;param::parameters,alTot::Float64,alLow::Float64,gH::Int64,gL=Int64,afac::Float64,bfac::Float64,divergence::Array,sfs::Array,dac::Array{Int64,1})

	# Matrix and values to solve
	dm 			= size(divergence,1)
	r           = Array{Float64}(undef, size(param.bRange,2) * dm , size(dac,1) + 3)
	param.al    = afac; param.be = bfac;
	param.alLow = alLow; param.alTot = alTot;
	param.gH = gH;param.gL = gL
	# Solve probabilites without B effect to achieve α value
	param.B = 0.999
	setThetaF!(param)
	setPpos!(param)

	r = zeros(size(param.bRange,2) * dm, dm , size(dac,1) + 3)
	for j in eachindex(param.bRange)
		param.B = param.bRange[j]
		# Solve mutation given a new B value.
		setThetaF!(param)
		# Solven given same probabilites probabilites ≠ bgs mutation rate.
		x,y,z::Array{Float64,2} = alphaByFrequencies(param,divergence,sfs,dac)
		# push!(r,z)
		r[j,:,:] = z
	end
	r = reshape(r,dm*size(param.bRange,2),size(dac,1)+3)

	return r
end