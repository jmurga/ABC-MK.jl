var documenterSearchIndex = {"docs":
[{"location":"reference/#*adap*-variable-1","page":"Reference","title":"adap variable","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"adap is the only variable exported from Analytical module. It is a Mutable structure contaning the variables required to solve the analytical approach. Any value can be easly changed. Remember adap should be change before the execution, in other case, alpha_(x) will be solve with the default values. To change all the values at once, you can use Analytical.changeParameters in order to set especific models.","category":"page"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Analytical.adap","category":"page"},{"location":"reference/#Analytical.adap","page":"Reference","title":"Analytical.adap","text":"adap( \n\tgam_neg::Int64,\n\tgL::Int64,\t\n\tgH::Int64,\n\talLow::Float64,\n\talTot::Float64,\n\ttheta_f::Float64,\n\ttheta_mid_neutral::Float64,\n\tal::Float64,\n\tbe::Float64,\n\tB::Float64,\n\tbRange::Array{Float64,1}\n\tpposL::Float64,\n\tpposH::Float64,\n\tN::Int64,\n\tn::Int64,\n\tLf::Int64,\n\trho::Float64,\n\tTE::Float64,\n)\n\nMutable structure containing the variables required to solve the analytical approach. All the functions are solve using the internal values of the structure. For this reason, adap is the only exported variable. Adap should be change before the perform the analytical approach, in other case, $\\alpha_{(x)}$ will be solve with the default values.\n\nParameters\n\ngam_neg::Int64: \ngL::Int64: \ngH::Int64: \nalLow::Float64: \nalTot::Float64: \ntheta_f::Float64: \ntheta_mid_neutral::Float64: \nal::Float64: \nbe::Float64: \nB::Float64: \nbRange::Array{Float64,1}:\npposL::Float64: \npposH::Float64: \nN::Int64: \nn::Int64: \nLf::Int64: \nrho::Float64: \nTE::Float64: \n\n\n\n\n\n","category":"constant"},{"location":"reference/#Analytical-estimation-1","page":"Reference","title":"Analytical estimation","text":"","category":"section"},{"location":"reference/#Fixations-1","page":"Reference","title":"Fixations","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Analytical.fixNeut\nAnalytical.fixNegB\nAnalytical.pFix\nAnalytical.fixPosSim","category":"page"},{"location":"reference/#Analytical.fixNeut","page":"Reference","title":"Analytical.fixNeut","text":"fixNeut()\n\nExpected neutral fixations rate reduce by a background selection value.\n\nmathbbED_s = (1 - p_- - p_+) B frac12N\n\nReturns\n\nFloat64: expected rate of neutral fixations.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.fixNegB","page":"Reference","title":"Analytical.fixNegB","text":"fixNegB(ppos)\n\nExpected fixation rate from negative DFE.\n\nmathbbED_n- =  p_-left(2^-alphabeta^alphaleft(-zetaalphafrac2+beta2 + zetaalpha12(2-frac1N+beta)right)right)\n\nArguments\n\nppos::Float64: selection coefficient.\n\nReturns\n\nFloat64: expected rate of fixations from negative DFE.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.pFix","page":"Reference","title":"Analytical.pFix","text":"pFix()\n\nExpected positive fixation rate.\n\nmathbbED_n+ =  p_+ cdot B cdot (1 - e^(-2s))\n\nArguments\n\nppos::Float64: selection coefficient.\n\nReturns\n\nFloat64: expected rate of positive fixation.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.fixPosSim","page":"Reference","title":"Analytical.fixPosSim","text":"fixPosSim(gamma,ppos)\n\nExpected positive fixations rate reduced due to the impact of background selection and linkage. The probabilty of fixation of positively selected alleles is reduced by a factor Φ across all deleterious linked sites Analytical.phiReduction.\n\nmathbbED_n+ =  Phi cdot mathbbED_n+\n\nArguments\n\nppos::Float64: selection coefficient\n\nReturns\n\nFloat64: expected rate of positive fixations under background selection\n\n\n\n\n\n","category":"function"},{"location":"reference/#Polymorphism-1","page":"Reference","title":"Polymorphism","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Analytical.DiscSFSNeutDown","category":"page"},{"location":"reference/#Analytical.DiscSFSNeutDown","page":"Reference","title":"Analytical.DiscSFSNeutDown","text":"DiscSFSNeutDown()\n\nExpected rate of neutral allele frequency reduce by background selection. The spectrum depends on the number of individual []\n\nmathbbEPs_(x) = sumx^*=xx^*=1f_B(x)\n\nReturn:\n\nArray{Float64}: expected rate of neutral alleles frequencies.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Summary-statistics-1","page":"Reference","title":"Summary statistics","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Analytical.poissonFixation\nAnalytical.poissonPolymorphism\nAnalytical.alphaByFrequencies","category":"page"},{"location":"reference/#Analytical.poissonFixation","page":"Reference","title":"Analytical.poissonFixation","text":"poissonFixation(observedValues,λds, λdn)\n\nDivergence sampling from Poisson distribution. The expected neutral and selected fixations are subset through their relative expected rates (Analytical.fixNeut, Analytical.fixNegB, Analytical.fixPosSim). Empirical values are used are used to simulate the locus L along a branch of time T from which the expected Ds and Dn raw count estimated given the mutation rate (mu). Random number generation is used to subset samples arbitrarily given the success rate lambda in the distribution.\n\nArguments\n\nobservedValues::Array{Int64,1}: Array containing the total observed divergence.\nλds: expected neutral fixations rate.\nλdn: expected selected fixations rate.\n\nReturns\n\nArray{Int64,1} containing the expected count of neutral and selected fixations.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.poissonPolymorphism","page":"Reference","title":"Analytical.poissonPolymorphism","text":"poissonPolymorphism(observedValues,λps,λpn)\n\nPolymorphism sampling from Poisson distributions. The total expected neutral and selected polimorphism are subset through the relative expected rates at the frequency spectrum (Analytical.fixNeut, Analytical.DiscSFSNeutDown,). Empirical sfs are used to simulate the locus L along a branch of time T from which the expected Ps and Pn raw count are estimated given the mutation rate (mu). Random number generation is used to subset samples arbitrarily from the whole sfs given each frequency success rate lambda in the distribution.\n\nArguments\n\nobservedValues::Array{Int64,1}: Array containing the total observed divergence.\nλps: expected neutral site frequency spectrum rate.\nλpn: expected selected site frequency spectrum rate.\n\nReturns\n\nArray{Int64,1} containing the expected total count of neutral and selected polymorphism.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.alphaByFrequencies","page":"Reference","title":"Analytical.alphaByFrequencies","text":"alphaByFrequencies(gammaL,gammaH,pposL,pposH,observedData,nopos)\n\nAnalytical α(x) estimation. We used the expected rates of divergence and polymorphism to approach the asympotic value accouting for background selection, weakly and strong positive selection. α(x) can be estimated taking into account the role of positive selected alleles or not. We solve α(x) from empirical observed values. The values will be use to sample from a Poisson distribution the total counts of polymorphism and divergence using the rates. The mutation rate, the locus length and the time of the branch should be proportional to the observed values. \n\nmathbbEalpha_x =  1 - left(fracmathbbED_smathbbED_NfracmathbbEP_NmathbbEP_Sright)\n\nArguments\n\ngammaL::Int64: strength of weakly positive selection\ngammaH::Int64: strength of strong positive selection\npposL::Float64: probability of weakly selected allele\npposH::Float64: probability of strong selected allele\nobservedData::Array{Any,1}: Array containing the total observed divergence, polymorphism and site frequency spectrum.\nnopos::String(\"pos\",\"nopos\",\"both\"): string to perform α(x) account or not for both positive selective alleles.\n\nReturns\n\nTuple{Array{Float64,1},Array{Float64,2}} containing α(x) and the summary statistics array (Ds,Dn,Ps,Pn,α).\n\n\n\n\n\n","category":"function"},{"location":"reference/#Inference-tools-1","page":"Reference","title":"Inference tools","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Analytical.parseSfs\nAnalytical.ABCreg\nAnalytical.meanQ","category":"page"},{"location":"reference/#Analytical.parseSfs","page":"Reference","title":"Analytical.parseSfs","text":"parseSfs(;data,output,sfsColumns,divColumns)\n\nFunction to parse polymorphism and divergence by subset of genes. The input data is based on supplementary material described at Uricchio et al. 2019.\n\nGeneId Pn DAF seppareted by commas Ps DAF separated by commas Dn Ds\nXXXX 0 ,0,0,0,0,0,0,0,0 0 ,0,0,0,0,0,0,0,0 0 0\nXXXX 0 ,0,0,0,0,0,0,0,0 0 ,0,0,0,0,0,0,0,0 0 0\nXXXX 0 ,0,0,0,0,0,0,0,0 0 ,0,0,0,0,0,0,0,0 0 0\n\nArguments\n\ndata: String or Array of strings containing files names with full path.\noutput::String: path to save file. Containing one file per input file.\nsfsColumns::Array{Int64,1}: non-synonymous and synonymous daf columns. Please introduce first the non-synonymous number.\ndivColumns::Array{Int64,1}: non-synonymous and synonymous divergence columns. Please introduce first the non-synonymous number.\n\nReturns\n\nArray{Array{Int64,N} where N,1}: Array of arrays containing the total polymorphic sites (1), total Site Frequency Spectrum (2) and total divergence (3). Each array contains one row/column per file.\nFile writed in output\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.ABCreg","page":"Reference","title":"Analytical.ABCreg","text":"ABCreg(data, prior, nparams, nsummaries, outputPath, outputPrefix,tolerance, regressionMode,regPath)\n\nJulia link to execute ABCreg. You should take into account that any other ABC could be used once the prior distributions are done. If you consider to use ABCreg please cite the publication and compile it in your system.\n\nArguments\n\ndata::String: Observed data. Produced by parseSfs.\noutput::String: path to save file. ABCreg will produce one file per lines inside data.\nnparams::Int64: number of parameters in prior distributions.\nnsummaries::Int64: number of observed summary statistics.\noutputPath::String: output path.\noutputPrefix::String: output prefix name.\ntolerance::Float64: tolerance for rejection acceptance in Euclidian distance.\nregressionMode::String: transformation (T or L).\n\nReturns\n\nArray{Array{Int64,N} where N,1}: Array of arrays containing the total polymorphic sites (1), total Site Frequency Spectrum (2) and total divergence (3). Each array contains one row/column per file.\nFile writed in output\n\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.meanQ","page":"Reference","title":"Analytical.meanQ","text":"meanQ(x,columns)\n\nFunction to retrieve mean and quantiles (95%) from posterior distributions.\n\nArguments\n\nx::Array{Float64,2}: posterior distribution.\ncolumns::Array{Int64,1}: columns to process.\n\nReturns\n\nArray{Array{Float64,2},1}: Array of array containing mean and quantiles by posterior distribution. Each array contains $\\alpha_{S}$, $\\alpha_{W}$ and $\\alpha$ information by column.\n\n\n\n\n\n","category":"function"},{"location":"#ABC-MK-1","page":"Home","title":"ABC-MK","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"ABC-MK is an analytical approximation to alpha_x. We explore the impact of linkage and background selection at positive selected alleles sites. The package solves anylitical approximations for different genetic scenarios in order to estimate the strenght and rate of adaptation. ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"When empircal values of polymorphim and divergence are given, they will be used to discern their expected correspoding values modeled under any Distribution of Fitness Effect (DFE) and background selection values (B). ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Our goal is to subset summary statistics given empirical observed values that would be used as prior distributions in ABC algorithms. Please check","category":"page"},{"location":"#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"To install our module we highly recommend to use LTS official Julia binaries. If is your first time using Julia, you can easily export the Julia bin through export PATH=\"/path/to/directory/julia-1.v.v/bin:$PATH\" in your shell. Since we use scipy to solve equations, the package depends on PyCall.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia -e 'using Pkg;Pkg.add(PackageSpec(path=\"https://github.com/jmurga/Analytical.jl\"))'","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Or from Pkg REPL (by pressing ] at Julia interpreter):","category":"page"},{"location":"#","page":"Home","title":"Home","text":"add https://github.com/jmurga/Analytical.jl","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Scipy installation   You can install scipy on your default Python or install it through Julia Conda:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia -e 'using Pkg;Pkg.add(\"PyCall\");using PyCall;pyimport_conda(\"scipy.optimize\", \"scipy\")'","category":"page"},{"location":"#","page":"Home","title":"Home","text":"If you cannot install properly scipy through Julia Conda try the following:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Set an empty Python enviroment and re-build PyCall: ENV[\"PYTHON\"]=\"\";  Pkg.build(\"PyCall\")\nRe-launch Julia and install the scipy.optimize module: using PyCall;pyimport_conda(\"scipy.optimize\", \"scipy)","category":"page"},{"location":"#Docker-1","page":"Home","title":"Docker","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"We provide a Docker image based on Debian including Julia and Jupyter notebook. You can access to Debian system or just to Jupyter pulling the image from dockerhub. Remember to link the folder /analysis with any folder at your home to save the results:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"# Pull the image\ndocker pull jmurga/mktest\n# Run docker bash interactive session linking to some local volume to export data. \ndocker run -i -t -v ${HOME}/folderPath:/analysis/folder  jmurga/mktest\n# Run only jupyter notebook from docker image. Change the port if 8888 is already used\ndocker run -i -t -v ${HOME}/folderPath:/analysis/folder -p 8888:8888 jmurga/mktest /bin/bash -c \"jupyter-lab --ip='*' --port=8888 --no-browser --allow-root\"","category":"page"},{"location":"#Dependencies-1","page":"Home","title":"Dependencies","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"All the dependecies are installed within the package. You don't need to install manually. If you experiment any problem contact us or try to reinstall Pycall and scipy.","category":"page"},{"location":"#Mandatory-dependencies-to-solve-the-analytical-equations-1","page":"Home","title":"Mandatory dependencies to solve the analytical equations","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Roots - root finding.\nDistributions - probability distributions.\nPyCall - directly call and fully interoperate with Python.\nSpecialFunctions - special mathematical functions in Julia.\nParameters - custom keyword constructor.","category":"page"},{"location":"#The-following-dependencies-are-required-to-use-all-the-funcionalities-(parse-SFS,-plots,-etc.)-1","page":"Home","title":"The following dependencies are required to use all the funcionalities (parse SFS, plots, etc.)","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"CSV\nParsers\nStatsBase\nDataFrames\nGZip","category":"page"},{"location":"#ABC-1","page":"Home","title":"ABC","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"We link ABCreg with julia in order to perform ABC estimations. If you are going to use ABCreg to do inference please cite the publication and compile it in your system. Anyway, once you get the priors distributions you can use any other ABC software.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"git clone https://github.com/molpopgen/ABCreg.git\ncd ABCreg/src && make","category":"page"},{"location":"#References-1","page":"Home","title":"References","text":"","category":"section"}]
}