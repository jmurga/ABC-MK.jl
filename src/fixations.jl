################################
######     Fixations      ######
################################

# E[Dn]  = LT(E[Dn+] + E[Dn-] + E[Dns])

# Neutral fixation reduced by background selection
@doc raw"""
```math
	Neutral fixations reduce by a background selection value. It takes into accoun the ammount probability of being synonymous.
	$\mathbb{E}\left[D_{s}\rigth] =  \left(1 - p_{-} - p_{+}) \cdot B \cdot \frac{1}{2N}\rigth)$
```
# Returns
	Rate of neutral fixation in a Float64
"""
function fixNeut()
	return 0.255*(1.0/(adap.B*adap.NN))
end

# Negative fixations
@doc raw"""
```math
	$\mathbb{E}\left[D_{n-}\right] =  p_{-} \left(2^-\alpha \cdot \beta^\alpha \cdot \left(-\zeta\left[\alpha,2+\beta/2] + \zeta\left(\left[\alpha,1/2*\left(\left(2-\fract{1}{N+\beta}\rigth)\rigth]\rigth)\rigth)$
```

# Arguments
	- ```ppos::Float64```: positive selection coefficient
Negative fixations.
# Returns
	Rate of fixations from negative DFE in a Float64
"""
function fixNegB(ppos::Float64)
	return 0.745*(1-ppos)*(2^(-adap.al))*(adap.B^(-adap.al))*(adap.be^adap.al)*(-SpecialFunctions.zeta(adap.al,1.0+adap.be/(2.0*adap.B))+SpecialFunctions.zeta(adap.al,0.5*(2-1.0/(adap.N*adap.B)+adap.be/adap.B)))
end

# Positive fixations
@doc raw"""
```math
	Positive fixation s
	$\mathbb{E}\left[D_{s}\rigth] =  \left(1 - p_{-} - p_{+}) \cdot B \cdot \frac{1}{2N}\rigth)$
```
# Returns
	Rate of neutral fixation in a Float64
"""
function pFix(gamma::Int64)

	s    = gamma/(adap.NN+0.0)
	pfix = (1.0-ℯ^(-2.0*s))/(1.0-ℯ^(-2.0*gamma))

	if s >= 0.1
		pfix = ℯ^(-(1.0+s))
		lim = 0
		while(lim < 200)
			pfix = ℯ^((1.0+s)*(pfix-1.0))
			lim +=1
		pfix = 1-pfix
		end
	end

	return pfix
end

# Positive fixations after apply Φ, reduction of positive fixations due deleterious linkage given a value B of background selection
function fixPosSim(gamma::Int64,ppos::Float64)

	S  = abs(adap.gam_neg/(1.0*adap.NN))
	r  = adap.rho/(2.0*adap.NN)
	μ  = adap.theta_f/(2.0*adap.NN)
	s  = gamma/(adap.NN*1.0)

	Ψ0 = SpecialFunctions.polygamma(1,(s+S)/r)
	Ψ1 = SpecialFunctions.polygamma(1,(r+adap.Lf*r+s+S)/r)
	CC = 1.0

	return 0.745 * ppos * ℯ^(-2.0*S*μ*(Ψ0-Ψ1)*CC^2/r^2) * pFix(gamma)
end