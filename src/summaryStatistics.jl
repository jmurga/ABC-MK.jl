################################
###    Summary statistics    ###
################################
"""
	poissonFixation(observedValues,λds, λdn)

Divergence sampling from Poisson distribution. The expected neutral and selected fixations are subset through their relative expected rates ([`Analytical.fixNeut`](@ref), [`Analytical.fixNegB`](@ref), [`Analytical.fixPosSim`](@ref)). Empirical values are used are used to simulate the locus *L* along a branch of time *T* from which the expected *Ds* and *Dn* raw count estimated given the mutation rate (``\\mu``). Random number generation is used to subset samples arbitrarily given the success rate ``\\lambda`` in the distribution.

```math
\\mathbb{E}[D_N] = X \\in Poisson\\left(\\lambda = D \\times \\left[\\frac{\\mathbb{E}[D_+] + \\mathbb{E}[D_-]}{\\mathbb{E}[D_+] + \\mathbb{E}[D_-] + \\mathbb{E}[D_0]}\\right]\\right)
```
```math
\\mathbb{E}[D_S] = X \\in Poisson\\left(\\lambda = D \\times \\left[\\frac{\\mathbb{E}[D_0]}{\\mathbb{E}[D_+] + \\mathbb{E}[D_-] + \\mathbb{E}[D_0]}\\right]\\right)
```
# Arguments
 - `observedValues::Array{Int64,1}`: Array containing the total observed divergence.
 - ` λds`: expected neutral fixations rate.
 - ` λdn`: expected selected fixations rate.
# Returns
 - `Array{Int64,1}` containing the expected count of neutral and selected fixations.

"""
function poissonFixation(;observedValues::Union{Int64,Array{Int64,1}}, λds::Float64, λdn::Float64)

	ds = λds / (λds + λdn)
	dn = λdn / (λds + λdn)

	# poissonS  = (ds .* observedValues) .|> Poisson
	# poissonD  = (dn .* observedValues) .|> Poisson
	sampledDs  = PoissonRandom.pois_rand.(ds .* observedValues)
	sampledDn  = PoissonRandom.pois_rand.(dn .* observedValues) 

	# sampledDs = rand.(poissonS,1)
	# sampledDn = rand.(poissonD,1)


	out = reduce(vcat,sampledDn),reduce(vcat,sampledDs)
	return out
end
"""
	poissonPolymorphism(observedValues,λps,λpn)

Polymorphism sampling from Poisson distributions. The total expected neutral and selected polimorphism are subset through the relative expected rates at the frequency spectrum ([`Analytical.fixNeut`](@ref), [`Analytical.DiscSFSNeutDown`](@ref),). Empirical sfs are used to simulate the locus *L* along a branch of time *T* from which the expected *Ps* and *Pn* raw count are estimated given the mutation rate (``\\mu``). Random number generation is used to subset samples arbitrarily from the whole sfs given each frequency success rate ``\\lambda`` in the distribution.

The success rate managing the Poisson distribution by the observed count each frequency.  We considered both sampling variance and process variance is affecting the number of variable alleles we sample from SFS. This variance arises from the random mutation-fixation process along the branch. To incorporate this variance we do one sample per frequency-bin and use the total sampled variation and the SFS for the summary statistics. 

```math
\\mathbb{E}[P_N] = \\sum_{x=0}^{x=1} X \\in Poisson\\left(\\lambda = SFS_{(x)} \\times \\left[\\frac{\\mathbb{E}[P_{+(x)}] + \\mathbb{E}[P_{-(x)}]}{\\mathbb{E}[P_{+(x)}] + \\mathbb{E}[P_{-(x)}] + \\mathbb{E}[P_{0(x)}]}\\right]\\right)
```

```math
\\mathbb{E}[P_S] = \\sum_{x=0}^{x=1} X \\in Poisson\\left(\\lambda = SFS_{(x)} \\times \\left[\\frac{\\mathbb{E}[P_{0(x)}]}{\\mathbb{E}[P_{+(x)}] + \\mathbb{E}[P_{-(x)}] + \\mathbb{E}[P_{0(x)}]}\\right]\\right)
```

# Arguments
 - `observedValues::Array{Int64,1}`: Array containing the total observed divergence.
 - ` λps `: expected neutral site frequency spectrum rate.
 - ` λpn `: expected selected site frequency spectrum rate.
# Returns
 - `Array{Int64,1}` containing the expected total count of neutral and selected polymorphism.

"""
function poissonPolymorphism(;observedValues::Union{Array{Int64,1},Array{Int64,2}}, λps::Array{Float64,1}, λpn::Array{Float64,1})

	λ1 = similar(λps);λ2 = similar(λpn)

	sampledPs = similar(observedValues)
	sampledPn = similar(observedValues)

	# Neutral λ
	λ1 .= @. λps / (λps + λpn)
	# λ1 = sum(λps) / (sum(λps) + sum(λpn))
	# Selected λ
	λ2 .= @. λpn / (λps + λpn)
	# λ2 = sum(λpn) / (sum(λps) + sum(λpn))

	# psPois(x,z=λ1) = reduce.(vcat,rand.((z .* x ).|> Poisson,1))
	# pnPois(x,z=λ2) = reduce.(vcat,rand.((z .* x ).|> Poisson,1))
	psPois(x,z=λ1) = PoissonRandom.pois_rand.((z .* x ))
	pnPois(x,z=λ2) = PoissonRandom.pois_rand.((z .* x ))

	sampledPs = psPois(observedValues)
	sampledPn = pnPois(observedValues)
	
	return (sampledPn, sampledPs)
end

function sampledAlpha(;d::Union{Int64,Array{Int64,1}},afs::Union{Array{Int64,1},Array{Int64,2}},λdiv::Array{Float64,2},λpol::Array{Float64,2},expV::Bool,bins::Int64=20)


	cumulativePs = cumulativeSfs(λpol[:,1])[:,1]
	cumulativePn = cumulativeSfs(λpol[:,2])[:,1]

	# Return expected values or not. Not using in no_pos
	if expV
		## Outputs
		expDn, expDs = poissonFixation(observedValues=d,λds=λdiv[1],λdn=λdiv[2])
		expPn, expPs = poissonPolymorphism(observedValues=afs,λps=cumulativePs,λpn=cumulativePn)
		cumulativeExpPn = view(permutedims(reduceSfs(expPn,bins)),1:bins,:)
		# cumulativeExpPn = cumulativeSfs(expPn)
		cumulativeExpPs = view(permutedims(reduceSfs(expPs,bins)),1:bins,:)
		# cumulativeExpPs = cumulativeSfs(expPs)

		## Alpha from expected values. Used as summary statistics
		ssAlpha = @. 1 - ((expDs/expDn)' * (cumulativeExpPn./cumulativeExpPs))
		ssAlpha = round.(ssAlpha,digits=5)

		return expDn,expDs,expPn,expPs,ssAlpha
	else
		
		α = 1 .- (((λdiv[1])./(λdiv[2])) .* (cumulativePn./cumulativePs))

		return α
	end
end

"""
	alphaByFrequencies(gammaL,gammaH,pposL,param.pposH,data,nopos)

Analytical α(x) estimation. Solve α(x) from the expectation generally. We used the expected rates of divergence and polymorphism to approach the asympotic value accouting for background selection, weakly and strong positive selection. α(x) can be estimated taking into account the role of positive selected alleles or not. In this way we explore the role of linkage to deleterious alleles in the coding region.

```math
\\mathbb{E}[\\alpha_{x}] =  1 - \\left(\\frac{\\mathbb{E}[D_{s}]}{\\mathbb{E}[D_{N}]}\\frac{\\mathbb{E}[P_{N}]}{\\mathbb{E}[P_{S}]}\\right)
```

# Arguments
 - `gammaL::Int64`: strength of weakly positive selection
 - `gammaH::Int64`: strength of strong positive selection
 - `pposL`::Float64: probability of weakly selected allele
 - `param.pposH`::Float64: probability of strong selected allele
 - `data::Array{Any,1}`: Array containing the total observed divergence, polymorphism and site frequency spectrum.
 - `nopos::String("pos","nopos","both")`: string to perform α(x) account or not for both positive selective alleles.

# Returns
 - `Array{Float64,1}` α(x).
"""
function analyticalAlpha(;param::parameters)

	##############################################################
	# Accounting for positive alleles segregating due to linkage #
	##############################################################

	# Fixation
	fN     = param.B*fixNeut(param)
	fNeg   = param.B*fixNegB(param,0.5*param.pposH+0.5*param.pposL)
	fPosL  = fixPosSim(param,param.gL,0.5*param.pposL)
	fPosH  = fixPosSim(param,param.gH,0.5*param.pposH)

	ds = fN
	dn = fNeg + fPosL + fPosH

	## Polymorphism
	neut = DiscSFSNeutDown(param)

	selH = DiscSFSSelPosDown(param,param.gH,param.pposH)
	selL = DiscSFSSelPosDown(param,param.gL,param.pposL)
	selN = DiscSFSSelNegDown(param,param.pposH+param.pposL)
	splitColumns(matrix) = (view(matrix, :, i) for i in 1:size(matrix, 2))
	tmp = cumulativeSfs(hcat(neut,selH,selL,selN))

	neut, selH, selL, selN = splitColumns(tmp)
	sel = (selH+selL)+selN

	# if (isnan(sel[1]))
	# 	sel[1]=0
	# elseif(isnan(sel[end]))
	# 	sel[end]=0
	# end

	ps = similar(neut); pn = similar(neut)
	ps .= @. neut / (sel+neut)
	pn .= @. sel / (sel+neut)

	## Outputs
	α = @. 1 - ((fN/(fPosL + fPosH +  fNeg + 0.0)) * (sel/neut))

	##################################################################
	# Accounting for for neutral and deleterious alleles segregating #
	##################################################################
	## Fixation
	fN_nopos     = fN*(param.theta_mid_neutral/2.)*param.TE*param.NN
	fNeg_nopos   = fNeg*(param.theta_mid_neutral/2.)*param.TE*param.NN
	fPosL_nopos  = fPosL*(param.theta_mid_neutral/2.)*param.TE*param.NN
	fPosH_nopos  = fPosH*(param.theta_mid_neutral/2.)*param.TE*param.NN

	ds_nopos = fN_nopos
	dn_nopos = fNeg_nopos + fPosL_nopos + fPosH_nopos

	## Polymorphism
	sel_nopos = selN
	ps_nopos  = similar(neut); pn_nopos = similar(neut)
	ps_nopos .= @. neut / (sel_nopos + neut)
	pn_nopos .= @. sel_nopos / (sel_nopos + neut)

	α_nopos = 1 .- (fN_nopos/(fPosL_nopos + fPosH_nopos +  fNeg_nopos + 0.0)) .* (sel_nopos./neut)

	##########
	# Output #
	##########
	# Asymp values
	# alphas = hcat(α,α_nopos)
	# asymp1 = asympFit(α,1.0)
	# asymp2 = asympFit(α_nopos,1.0)
	
	# c1 = view(alphas,convert(Int64,ceil(size(alphas,1)*0.9)),:)
	# c2 = view(alphas,convert(Int64,ceil(size(alphas,1)*0.8)),:)
	# c3 = view(alphas,convert(Int64,ceil(size(alphas,1)*0.75)),:)

	return (α,α_nopos)
	# return (α,α_nopos,[α[end] asymp1[1] c1[1] c2[1] c3[1]],[α_nopos[end] asymp2[1] c1[2] c2[2] c3[2]])
end

"""
	alphaByFrequencies(gammaL,gammaH,pposL,pposH,observedData,nopos)

Analytical α(x) estimation. We used the expected rates of divergence and polymorphism to approach the asympotic value accouting for background selection, weakly and strong positive selection. α(x) can be estimated taking into account the role of positive selected alleles or not. We solve α(x) from empirical observed values. The values will be use to sample from a Poisson distribution the total counts of polymorphism and divergence using the rates. The mutation rate, the locus length and the time of the branch should be proportional to the observed values.

```math
\\mathbb{E}[\\alpha_{x}] =  1 - \\left(\\frac{\\mathbb{E}[D_{s}]}{\\mathbb{E}[D_{N}]}\\frac{\\mathbb{E}[P_{N}]}{\\mathbb{E}[P_{S}]}\\right)
```

# Arguments
 - `gammaL::Int64`: strength of weakly positive selection
 - `gammaH::Int64`: strength of strong positive selection
 - `pposL`::Float64: probability of weakly selected allele
 - `pposH`::Float64: probability of strong selected allele
 - `observedData::Array{Any,1}`: Array containing the total observed divergence, polymorphism and site frequency spectrum.
 - `nopos::String("pos","nopos","both")`: string to perform α(x) account or not for both positive selective alleles.

# Returns
 - `Tuple{Array{Float64,1},Array{Float64,2}}` containing α(x) and the summary statistics array (Ds,Dn,Ps,Pn,α).
"""
function alphaByFrequencies(param::parameters,divergence::Array{Int64,1},sfs::Array{Int64,2},bins::Int64,cutoff::Float64)

	##############################################################
	# Accounting for positive alleles segregating due to linkage #
	##############################################################

	# Fixation
	fN     = param.B*fixNeut(param)
	fNeg   = param.B*fixNegB(param,0.5*param.pposH+0.5*param.pposL)
	fPosL  = fixPosSim(param,param.gL,0.5*param.pposL)
	fPosH  = fixPosSim(param,param.gH,0.5*param.pposH)

	ds = fN
	dn = fNeg + fPosL + fPosH

	## Polymorphism
	neut = DiscSFSNeutDown(param)

	selH = DiscSFSSelPosDown(param,param.gH,param.pposH);
	selL = DiscSFSSelPosDown(param,param.gL,param.pposL);
	selN = DiscSFSSelNegDown(param,param.pposH+param.pposL);

	sel = (selH+selL)+selN

	## Outputs
	α = sampledAlpha(d=divergence,afs=sfs,λdiv=hcat(ds,dn),λpol=hcat(neut,sel),expV=false,bins=bins)
	α = view(α,1:trunc(Int64,param.nn*cutoff),:)
	expectedDn, expectedDs, expectedPn, expectedPs, summStat = sampledAlpha(d=divergence,afs=sfs,λdiv=hcat(ds,dn),λpol=hcat(neut,sel),expV=true,bins=bins)
	boolArr = summStat[end,:] .> 0 
	
	while sum(boolArr) < size(summStat,2)
		id = findall(x ->x == false, boolArr)
		
		if size(id,1) < 2
			id = id[1]
		end

		expectedDn[id], expectedDs[id], expectedPn[:,id], expectedPs[:,id], summStat[:,id] = sampledAlpha(d=divergence[id],afs=sfs[:,id],λdiv=hcat(ds,dn),λpol=hcat(neut,sel),expV=true,bins=bins)
		# println(summStat)
		boolArr[id] = summStat[end,id] .> 0 

	end

	##################################################################
	# Accounting for for neutral and deleterious alleles segregating #
	##################################################################
	## Fixation
	fN_nopos     = fN*(param.theta_mid_neutral/2.)*param.TE*param.NN
	fNeg_nopos   = fNeg*(param.theta_mid_neutral/2.)*param.TE*param.NN
	fPosL_nopos  = fPosL*(param.theta_mid_neutral/2.)*param.TE*param.NN
	fPosH_nopos  = fPosH*(param.theta_mid_neutral/2.)*param.TE*param.NN

	ds_nopos = fN_nopos
	dn_nopos = fNeg_nopos + fPosL_nopos + fPosH_nopos

	## Polymorphism
	# sel_nopos = view(selN,1:lastindex(selN)-1,:)
	sel_nopos = selN

	## Outputs
	α_nopos = sampledAlpha(d=divergence,afs=sfs,λdiv=hcat(ds_nopos,dn_nopos),λpol=hcat(neut,sel_nopos),expV=false)
	α_nopos = view(α_nopos,1:trunc(Int64,param.nn*cutoff),:)

	##########
	# Output #
	##########
	# Handling error to return any array size
	# Dn,Ds,Pn,Ps = try
	# 	permutedims(expectedDn),permutedims(expectedDs),permutedims(sum(expectedPn,dims=1)),permutedims(sum(expectedPs,dims=1))
	# catch err
	# 	expectedDn,expectedDs,sum(expectedPn,dims=1),sum(expectedPs,dims=1)
	# end

	Dn,Ds,Pn,Ps = expectedDn,expectedDs,sum(view(expectedPn,1,:),dims=2),sum(view(expectedPs,1,:),dims=2)

	alphas = round.(summaryAlpha(view(α,size(α,1),:),view(α_nopos,size(α_nopos,1),:)),digits=5)
	alphas = repeat(alphas,outer=[2,1])

	expectedValues = hcat(DataFrame(alphas),DataFrame(hcat(Dn,Ds,Pn,Ps)),DataFrame(permutedims(summStat)),makeunique=true)

	return (α,α_nopos,expectedValues)
end

function summaryAlpha(x::AbstractArray,y::AbstractArray)

	out   = Array{Float64}(undef,size(x,1),3)

	for i in 1:size(x,1)
		out[i,:] .= x[i], abs.(y[i])-abs.(x[i]), y[i]
	end

	return out
end

function summaryStatistics(fileName::String,summStats)

	for i in 1:size(summStats,1)
		write(fileName * string(i) * ".tsv", summStats[i:i,:], delim='\t', append=true)
	end

end

function asympFit(alphaValues::Array{Float64,1})

	# Model
	asympModel(x,p) = @. p[1] + p[2]*exp(-x*p[3])

	# Data
	counts        = size(alphaValues,1)
	alphaTrim     = convert(Array,view(alphaValues,1:counts,1))

	# Fit values
	fitted         = LsqFit.curve_fit(asympModel,collect(1:size(alphaTrim,1)),alphaTrim,[-1.0,-1.0,1.0];lower=[-1.0,-1.0,1.0],upper=[1.0, 1.0, 10.0])
	asymp          = asympModel(counts,fitted.param)
	# ciLow, ciHigh   = try
	# 	LsqFit.confidence_interval(fitted)[1][1],LsqFit.confidence_interval(fitted)[1][2]
	# catch err
	# 	(0.0,0.0)
	# end
	# plot(x,alphaTrim)
	# plot!(x,asympModel(x,fitted.param),legend=:bottomleft)

	# return [asymp ciLow ciHigh]
	return asymp
end

# function scipyFit(alphaValues::Array{Float64,1})

# 	x = collect(1:size(alphaValues,1))
# 	py"""
# 	import numpy as np
# 	# from numba import *
# 	from scipy import optimize
# 	# @njit(cache=True)
# 	def exp_model(x,a,b,c):
# 		return a + b*np.exp(-x*c)
# 	# @jit(cache=True)
# 	def test(x1,al):
# 		res = {}
# 		model = optimize.curve_fit(exp_model,x1, al, method='dogbox')

# 		res['a'] = model[0][0]
# 		res['b'] = model[0][1]
# 		res['c'] = model[0][2]

# 		# alpha for predicted model
# 		res['alpha'] = exp_model(x1[-1], res['a'], res['b'], res['c'])
# 		return(res['alpha'])
# 	"""
		
# 	# plot(x,alphaTrim)
# 	# plot!(x,asympModel(x,fitted.param),legend=:bottomleft)

# 	return py"test"(PyObject(x),PyObject(alphaValues[:,1]))

# end

