var documenterSearchIndex = {"docs":
[{"location":"#Analytical-1","page":"Home","title":"Analytical","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Analytical approximation to alpha_x accounting for linkage. We explore the impact of linkage and background selection at positive selected alleles sites. The package  solve anylitical approximations for different genetic scenarios in order to estimate the strenght and rate of adaptation. ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"When empircal values of polymorphim and divergence are given, they will be used to discern their expected correspoding values modeled under any Distribution of Fitness Effect (DFE) and background selection values (B). ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Our goal is to subset summary statistics given a set of empirical values for any genetic scenario that would be used as prior distributions in ABC algorithms.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Analytical.fixNeut\nAnalytical.fixNegB\nAnalytical.pFix\nAnalytical.fixPosSim\nAnalytical.DiscSFSNeutDown\nAnalytical.poissonFixation\nAnalytical.poissonPolymorphism\nAnalytical.alphaByFrequencies\nAnalytical.phiReduction\nadap","category":"page"},{"location":"#Analytical.fixNeut","page":"Home","title":"Analytical.fixNeut","text":"fixNeut()\n\nExpected neutral fixations rate reduce by a background selection value.\n\nmathbbED_s = (1 - p_- - p_+) B frac12N\n\nReturns\n\nFloat64: expected rate of neutral fixations.\n\n\n\n\n\n","category":"function"},{"location":"#Analytical.fixNegB","page":"Home","title":"Analytical.fixNegB","text":"fixNegB(ppos)\n\nExpected fixation rate from negative DFE.\n\nmathbbED_n- =  p_-left(2^-alphabeta^alphaleft(-zetaalphafrac2+beta2 + zetaalpha12(2-frac1N+beta)right)right)\n\nArguments\n\nppos::Float64: selection coefficient.\n\nReturns\n\nFloat64: expected rate of fixations from negative DFE.\n\n\n\n\n\n","category":"function"},{"location":"#Analytical.pFix","page":"Home","title":"Analytical.pFix","text":"pFix()\n\nExpected positive fixation rate.\n\nmathbbED_n+ =  p_+ cdot B cdot (1 - e^(-2s))\n\nArguments\n\nppos::Float64: selection coefficient.\n\nReturns\n\nFloat64: expected rate of positive fixation.\n\n\n\n\n\n","category":"function"},{"location":"#Analytical.fixPosSim","page":"Home","title":"Analytical.fixPosSim","text":"fixPosSim(gamma,ppos)\n\nExpected positive fixations rate reduced due to the impact of background selection and linkage. The probabilty of fixation of positively selected alleles is reduced by a factor Φ across all deleterious linked sites Analytical.phiReduction.\n\nmathbbED_n+ =  Phi cdot mathbbED_n+\n\nArguments\n\nppos::Float64: selection coefficient\n\nReturns\n\nFloat64: expected rate of positive fixations under background selection\n\n\n\n\n\n","category":"function"},{"location":"#Analytical.DiscSFSNeutDown","page":"Home","title":"Analytical.DiscSFSNeutDown","text":"DiscSFSNeutDown()\n\nExpected rate of neutral allele frequency reduce by background selection. The spectrum depends on the number of individual []\n\nmathbbEPs_(x) = sumx^*=xx^*=1f_B(x)\n\nReturn:\n\nArray{Float64}: expected rate of neutral alleles frequencies.\n\n\n\n\n\n","category":"function"},{"location":"#Analytical.poissonFixation","page":"Home","title":"Analytical.poissonFixation","text":"poissonFixation(observedValues,λds, λdn)\n\nDivergence sampling from Poisson distribution. The expected neutral and selected fixations are subset through their relative expected rates (Analytical.fixNeut, Analytical.fixNegB, Analytical.fixPosSim). Empirical values are used are used to simulate the locus L along a branch of time T from which the expected Ds and Dn raw count estimated given the mutation rate (mu). Random number generation is used to subset samples arbitrarily given the success rate lambda in the distribution.\n\nArguments\n\nobservedValues::Array{Int64,1}: Array containing the total observed divergence.\nλds: expected neutral fixations rate.\nλdn: expected selected fixations rate.\n\nReturns\n\nArray{Int64,1} containing the expected count of neutral and selected fixations.\n\n\n\n\n\n","category":"function"},{"location":"#Analytical.poissonPolymorphism","page":"Home","title":"Analytical.poissonPolymorphism","text":"poissonPolymorphism(observedValues,λps,λpn)\n\nPolymorphism sampling from Poisson distributions. The total expected neutral and selected polimorphism are subset through the relative expected rates at the frequency spectrum (Analytical.fixNeut, Analytical.DiscSFSNeutDown,). Empirical SFS are used to simulate the locus L along a branch of time T from which the expected Ps and Pn raw count are estimated given the mutation rate (mu). Random number generation is used to subset samples arbitrarily from the whole SFS given each frequency success rate lambda in the distribution.\n\nArguments\n\nobservedValues::Array{Int64,1}: Array containing the total observed divergence.\nλps: expected neutral site frequency spectrum rate.\nλpn: expected selected site frequency spectrum rate.\n\nReturns\n\nArray{Int64,1} containing the expected total count of neutral and selected polymorphism.\n\n\n\n\n\n","category":"function"},{"location":"#Analytical.alphaByFrequencies","page":"Home","title":"Analytical.alphaByFrequencies","text":"alphaByFrequencies(gammaL,gammaH,pposL,pposH,observedData,nopos)\n\nAnalytical α(x) estimation. We used the expected rates of divergence and polymorphism to approach the asympotic value accouting for background selection, weakly and strong positive selection. α(x) can be estimated taking into account the role of positive selected alleles or not. In this way we explore the role of linkage to deleterious alleles in the coding region. Solve α(x) from the expectation rates:\n\nmathbbEalpha_x =  1 - left(fracmathbbED_smathbbED_NfracmathbbEP_NmathbbEP_Sright)\n\nArguments\n\ngammaL::Int64: strength of weakly positive selection\ngammaH::Int64: strength of strong positive selection\npposL::Float64: probability of weakly selected allele\npposH::Float64: probability of strong selected allele\nobservedData::Array{Any,1}: Array containing the total observed divergence, polymorphism and site frequency spectrum.\nnopos::String(\"pos\",\"nopos\",\"both\"): string to perform α(x) account or not for both positive selective alleles.\n\nReturns\n\nTuple{Array{Float64,1},Array{Float64,2}} containing α(x) and the summary statistics array (Ds,Dn,Ps,Pn,α).\n\n\n\n\n\n","category":"function"},{"location":"#Analytical.phiReduction","page":"Home","title":"Analytical.phiReduction","text":"phiReduction(gamma,ppos)\n\nReduction in fixation probabilty due to background selection and linkage. The formulas used have been subjected to several theoretical works (Charlesworth B., 1994, Hudson et al., 1995, Nordborg et al. 1995, Barton NH., 1995). \n\nThe fixation probabilty of selected alleles are reduce by a factor phi:\n\nphi(ts) = e^frac-2mut(1+fracrLt+frac2st)\n\nMultiplying across all deleterious linkes sites, we find:\n\nPhi = prod_1^L = phi(ts) = e^frac-2tmu(psi1fracr+2s+Lr - psi1fracr(L+1)+2s+tr)r^2\n\nphi(ts) = e^frac-2tmu(psi1fracr+2s+Lr - psi1fracr(L+1)+2s+tr)r^2\n\nArguments\n\ngamma::Int64: selection coefficient.\n\nReturns\n\nFloat64: expected rate of positive fixations under background selection.\n\n\n\n\n\n","category":"function"},{"location":"#Analytical.adap","page":"Home","title":"Analytical.adap","text":"adap( \n\tgam_neg::Int64,\n\tgL::Int64,\t\n\tgH::Int64,\n\talLow::Float64,\n\talTot::Float64,\n\ttheta_f::Float64,\n\ttheta_mid_neutral::Float64,\n\tal::Float64,\n\tbe::Float64,\n\tB::Float64,\n\tbRange::Array{Float64,1}\n\tpposL::Float64,\n\tpposH::Float64,\n\tN::Int64,\n\tn::Int64,\n\tLf::Int64,\n\trho::Float64,\n\tTE::Float64,\n)\n\nMutable structure containing the variables required to solve the analytical approach. All the functions are solve using the internal values of the structure. For this reason, adap is the only exported variable. Adap should be change before the perform the analytical approach, in other case, $\\alpha_{(x)}$ will be solve with the default values.\n\nParameters\n\ngam_neg::Int64: \ngL::Int64: \ngH::Int64: \nalLow::Float64: \nalTot::Float64: \ntheta_f::Float64: \ntheta_mid_neutral::Float64: \nal::Float64: \nbe::Float64: \nB::Float64: \nbRange::Array{Float64,1}:\npposL::Float64: \npposH::Float64: \nN::Int64: \nn::Int64: \nLf::Int64: \nrho::Float64: \nTE::Float64: \n\n\n\n\n\n","category":"constant"},{"location":"#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"To install our module we highly recommend to use LTS official Julia binaries. If is your first time using Julia, you can easily export the Julia bin through export PATH=\"/path/to/directory/julia-1.v.v/bin:$PATH\" in your shell. Since we use scipy to solve equations, the package depends on PyCall:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia -e 'using Pkg;Pkg.add(\"PyCall\");using PyCall;pyimport_conda(\"scipy.optimize\", \"scipy\")'\njulia -e 'using Pkg;Pkg.add(PackageSpec(path=\"https://github.com/jmurga/Analytical.jl\"))'","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Or from Pkg REPL (by pressing ] at Julia interpreter):","category":"page"},{"location":"#","page":"Home","title":"Home","text":"add PyCall\nadd \"https://github.com/jmurga/Analytical.jl\"\n# exits from Pkg REPL and run\nusing PyCall\npyimport_conda(\"scipy.optimize\", \"scipy\")","category":"page"},{"location":"#","page":"Home","title":"Home","text":"In addition we provide a Docker image based on Debian including Julia and Jupyter notebook. You can access to Debian system or just to Jupyter pulling the image from dockerhub. Remember to link the folder /analysis with any folder at your home to save the results:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"# Pull the image\ndocker pull jmurga/mktest\n# Run docker bash interactive session linking to some local volume to export data. \ndocker run -i -t -v ${HOME}/folderPath:/analysis/folder  jmurga/mktest\n# Run only jupyter notebook from docker image. Change the port if 8888 is already used\ndocker run -i -t -v ${HOME}/folderPath:/analysis/folder -p 8888:8888 jmurga/mktest /bin/bash -c \"jupyter-lab --ip='*' --port=8888 --no-browser --allow-root\"","category":"page"},{"location":"#Dependencies-1","page":"Home","title":"Dependencies","text":"","category":"section"},{"location":"#References-1","page":"Home","title":"References","text":"","category":"section"}]
}
