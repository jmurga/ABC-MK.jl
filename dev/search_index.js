var documenterSearchIndex = {"docs":
[{"location":"analytical/#Analytical-estimation-1","page":"Analytical estimations","title":"Analytical estimation","text":"","category":"section"},{"location":"analytical/#Solving-\\alpha_{(x)}-1","page":"Analytical estimations","title":"Solving alpha_(x)","text":"","category":"section"},{"location":"analytical/#","page":"Analytical estimations","title":"Analytical estimations","text":"Our method is based in the analytical solution of alpha_(x) given a genetic scenario. The method could be extended to any DFE and background selection values in order to get summary statistics that can be used as prior distrubtions at ABC methods. In this example we show how asympotic alpha is affected by linkage and background selection.","category":"page"},{"location":"analytical/#","page":"Analytical estimations","title":"Analytical estimations","text":"adap is the only variable exported from Analytical module. It is a Mutable structure contaning the variables required to solve the analytical approach. Any value can be easly changed. Remember adap should be change before the execution, in other case, alpha_(x) will be solve with the default values. To change all the values at once, you can use Analytical.changeParameters in order to set specific models. Please take into account some package used here could be changed. ","category":"page"},{"location":"analytical/#","page":"Analytical estimations","title":"Analytical estimations","text":"Load the modules","category":"page"},{"location":"analytical/#","page":"Analytical estimations","title":"Analytical estimations","text":"using Analytical, Plots","category":"page"},{"location":"analytical/#","page":"Analytical estimations","title":"Analytical estimations","text":"Set the model parameters","category":"page"},{"location":"analytical/#","page":"Analytical estimations","title":"Analytical estimations","text":"Analytical.changeParameters(gam_neg=-83,\n                            gL=10,\n                            gH=500,\n                            alLow=0.2,\n                            alTot=0.2,\n                            theta_f=1e-3,\n                            theta_mid_neutral=1e-3,\n                            al=0.184,\n                            be=0.000402,\n                            B=0.999,\n                            bRange=append!(collect(0.2:0.05:0.95),\n                            0.999),\n                            pposL=0.001,\n                            pposH=0.0,\n                            N=500,\n                            n=25,\n                            Lf=10^6,\n                            rho=0.001,\n                            TE=5.0,\n                            convoluteBinomial=true\n                        )","category":"page"},{"location":"analytical/#","page":"Analytical estimations","title":"Analytical estimations","text":"Solving the model. Here we solve alpha generally using the expected rates. We are not considering any especific mutation process over a locus and branch time.","category":"page"},{"location":"analytical/#","page":"Analytical estimations","title":"Analytical estimations","text":"Analytical.set_theta_f()\ntheta_f = adap.theta_f\nadap.B = 0.999\nAnalytical.set_theta_f()\nAnalytical.setPpos()\nadap.theta_f = theta_f\nadap.B= B\n\nx,y = Analytical.analyticalAlpha(gammaL=adap.gL,gammaH=adap.H,pposL=adap.pposL,pposH=adap.pposH)","category":"page"},{"location":"analytical/#","page":"Analytical estimations","title":"Analytical estimations","text":"Plotting the results. x contains alpha_(x) accounting for weakly beneficial alleles. y contains the true value of alpha_(x), not accounting for weakly beneficial alleles.","category":"page"},{"location":"analytical/#","page":"Analytical estimations","title":"Analytical estimations","text":"Plots.PlotMeasures\nPlots.gr()\nPlots.theme(:bright)\n\nPlots.plot(collect(1:size(x,1)),hcat(x,y),\n    legend = :bottomright,\n    seriestype = :line,\n    xlabel = \"Derived Alleles Counts\",\n    ylabel = \"α\",\n    label = [\"All alleles\" \"Neutral + deleterious\"],\n    markershapes= [:circle :circle],\n    lw = 1,\n    xscale = :log,\n    fmt = :svg,\n    bottom_margin=10 * Plots.PlotMeasures.mm,\n    left_margin=10 * Plots.PlotMeasures.mm,\n    size=(700,500)\n)","category":"page"},{"location":"analytical/#","page":"Analytical estimations","title":"Analytical estimations","text":"(Image: image)","category":"page"},{"location":"reference/#Model-parameters-1","page":"Reference","title":"Model parameters","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"adap is the only variable exported from Analytical module. It is a Mutable structure contaning the variables required to solve the analytical approach. Any value can be easly changed. Remember adap should be change before the execution, in other case, alpha_(x) will be solve with the default values. To change all the values at once, you can use Analytical.changeParameters in order to set specific models.","category":"page"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Analytical.adap","category":"page"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Analytical.changeParameters\nAnalytical.Br\nAnalytical.set_theta_f\nAnalytical.setPpos\nAnalytical.binomOp","category":"page"},{"location":"reference/#Analytical.Br","page":"Reference","title":"Analytical.Br","text":"Br(Lmax,theta)\n\nExpected reduction in nucleotide diversity. Explored at Charlesworth B., 1994:\n\nfracpipi_0 = e^frac4muL2rL+t\n\nArguments\n\nLmax::Int64: non-coding flaking length\ntheta::Float64\n\nReturns\n\nFloat64: expected reduction in diversity given a non-coding length, mutation rate and defined recombination.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.set_theta_f","page":"Reference","title":"Analytical.set_theta_f","text":"set_theta_f(param)\n\nFind the optimum mutation given the expected reduction in nucleotide diversity (B value) in a locus.\n\nReturns\n\nadap.theta_f::Float64: changes adap.theta_f value.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.binomOp","page":"Reference","title":"Analytical.binomOp","text":"binomOp(param)\n\nSite Frequency Spectrum convolution depeding on background selection values. Pass the SFS to a binomial distribution to sample the allele frequencies probabilites.\n\nReturns\n\nArray{Float64,2}: convoluted SFS given a B value. It will be saved at adap.bn.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical-estimation-1","page":"Reference","title":"Analytical estimation","text":"","category":"section"},{"location":"reference/#Fixations-1","page":"Reference","title":"Fixations","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Analytical.fixNeut\nAnalytical.fixNegB\nAnalytical.pFix\nAnalytical.fixPosSim","category":"page"},{"location":"reference/#Analytical.fixNeut","page":"Reference","title":"Analytical.fixNeut","text":"fixNeut()\n\nExpected neutral fixations rate reduce by a background selection value.\n\nmathbbED_s = (1 - p_- - p_+) B frac12N\n\nReturns\n\nFloat64: expected rate of neutral fixations.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.fixNegB","page":"Reference","title":"Analytical.fixNegB","text":"fixNegB(ppos)\n\nExpected fixation rate from negative DFE.\n\nmathbbED_n- =  p_-left(2^-alphabeta^alphaleft(-zetaalphafrac2+beta2 + zetaalpha12(2-frac1N+beta)right)right)\n\nArguments\n\nppos::Float64: positive selected alleles probabilty.\n\nReturns\n\nFloat64: expected rate of fixations from negative DFE.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.pFix","page":"Reference","title":"Analytical.pFix","text":"pFix()\n\nExpected positive fixation rate.\n\nmathbbED_n+ =  p_+ cdot B cdot (1 - e^(-2s))\n\nArguments\n\nppos::Float64: positive selected alleles probabilty.\n\nReturns\n\nFloat64: expected rate of positive fixation.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.fixPosSim","page":"Reference","title":"Analytical.fixPosSim","text":"fixPosSim(gamma,ppos)\n\nExpected positive fixations rate reduced due to the impact of background selection and linkage. The probabilty of fixation of positively selected alleles is reduced by a factor Φ across all deleterious linked sites Analytical.phiReduction.\n\nmathbbED_n+ =  Phi cdot mathbbED_n+\n\nArguments\n\nppos::Float64: positive selected alleles probabilty.\n\nReturns\n\nFloat64: expected rate of positive fixations under background selection\n\n\n\n\n\n","category":"function"},{"location":"reference/#Polymorphism-1","page":"Reference","title":"Polymorphism","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Analytical.DiscSFSNeutDown\nAnalytical.DiscSFSSelPosDown\nAnalytical.DiscSFSSelNegDown\nAnalytical.cumulativeSfs","category":"page"},{"location":"reference/#Analytical.DiscSFSSelPosDown","page":"Reference","title":"Analytical.DiscSFSSelPosDown","text":"DiscSFSSelPosDown(gammaValue,ppos)\n\nExpected rate of positive selected allele frequency reduce by background selection. The spectrum depends on the number of individuals.\n\nArguments\n\ngammaValue::Int64: selection strength.\nppos::Float64: positive selected alleles probabilty.\n\nReturn:\n\nArray{Float64}: expected positive selected alleles frequencies.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.DiscSFSSelNegDown","page":"Reference","title":"Analytical.DiscSFSSelNegDown","text":"DiscSFSSelNegDown(param,ppos)\n\nExpected rate of positive selected allele frequency reduce by background selection. Spectrum drawn on a gamma DFE. It depends on the number of individuals.\n\nArguments\n\nppos::Float64: positive selected alleles probabilty.\n\nReturn:\n\nArray{Float64}: expected negative selected alleles frequencies.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.cumulativeSfs","page":"Reference","title":"Analytical.cumulativeSfs","text":"cumulativeSfs(sfsTemp)\n\nChanging SFS considering all values above a frequency x. The original asymptotic-MK approach takes Pn(x) and Ps(x) as the number of polymorphic sites at frequency x rather than above x, but this approach scales poorly as sample size increases. We define the polymorphic spectrum as stated above since these quantities trivially have the same asymptote but are less affected by changing sample size.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Summary-statistics-1","page":"Reference","title":"Summary statistics","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Analytical.poissonFixation\nAnalytical.poissonPolymorphism\nAnalytical.alphaByFrequencies","category":"page"},{"location":"reference/#Analytical.poissonFixation","page":"Reference","title":"Analytical.poissonFixation","text":"poissonFixation(observedValues,λds, λdn)\n\nDivergence sampling from º distribution. The expected neutral and selected fixations are subset through their relative expected rates (Analytical.fixNeut, Analytical.fixNegB, Analytical.fixPosSim). Empirical values are used are used to simulate the locus L along a branch of time T from which the expected Ds and Dn raw count estimated given the mutation rate (mu). Random number generation is used to subset samples arbitrarily given the success rate lambda in the distribution.\n\nmathbbED_N = X in Poissonleft(lambda = D times leftfracmathbbED_+ + mathbbED_-mathbbED_+ + mathbbED_- + mathbbED_0rightright)\n\nmathbbED_S = X in Poissonleft(lambda = D times leftfracmathbbED_0mathbbED_+ + mathbbED_- + mathbbED_0rightright)\n\nArguments\n\nobservedValues::Array{Int64,1}: Array containing the total observed divergence.\nλds: expected neutral fixations rate.\nλdn: expected selected fixations rate.\n\nReturns\n\nArray{Int64,1} containing the expected count of neutral and selected fixations.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.poissonPolymorphism","page":"Reference","title":"Analytical.poissonPolymorphism","text":"poissonPolymorphism(observedValues,λps,λpn)\n\nPolymorphism sampling from Poisson distributions. The total expected neutral and selected polimorphism are subset through the relative expected rates at the frequency spectrum (Analytical.fixNeut, Analytical.DiscSFSNeutDown,). Empirical sfs are used to simulate the locus L along a branch of time T from which the expected Ps and Pn raw count are estimated given the mutation rate (mu). Random number generation is used to subset samples arbitrarily from the whole sfs given each frequency success rate lambda in the distribution.\n\nThe success rate managing the Poisson distribution by the observed count each frequency.  We considered both sampling variance and process variance is affecting the number of variable alleles we sample from SFS. This variance arises from the random mutation-fixation process along the branch. To incorporate this variance we do one sample per frequency-bin and use the total sampled variation and the SFS for the summary statistics. \n\nmathbbEP_N = sum_x=0^x=1 X in Poissonleft(lambda = SFS_(x) times leftfracmathbbEP_+(x) + mathbbEP_-(x)mathbbEP_+(x) + mathbbEP_-(x) + mathbbEP_0(x)rightright)\n\nmathbbEP_S = sum_x=0^x=1 X in Poissonleft(lambda = SFS_(x) times leftfracmathbbEP_0(x)mathbbEP_+(x) + mathbbEP_-(x) + mathbbEP_0(x)rightright)\n\nArguments\n\nobservedValues::Array{Int64,1}: Array containing the total observed divergence.\nλps: expected neutral site frequency spectrum rate.\nλpn: expected selected site frequency spectrum rate.\n\nReturns\n\nArray{Int64,1} containing the expected total count of neutral and selected polymorphism.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.alphaByFrequencies","page":"Reference","title":"Analytical.alphaByFrequencies","text":"alphaByFrequencies(gammaL,gammaH,pposL,pposH,observedData,nopos)\n\nAnalytical α(x) estimation. We used the expected rates of divergence and polymorphism to approach the asympotic value accouting for background selection, weakly and strong positive selection. α(x) can be estimated taking into account the role of positive selected alleles or not. We solve α(x) from empirical observed values. The values will be use to sample from a Poisson distribution the total counts of polymorphism and divergence using the rates. The mutation rate, the locus length and the time of the branch should be proportional to the observed values.\n\nmathbbEalpha_x =  1 - left(fracmathbbED_smathbbED_NfracmathbbEP_NmathbbEP_Sright)\n\nArguments\n\ngammaL::Int64: strength of weakly positive selection\ngammaH::Int64: strength of strong positive selection\npposL::Float64: probability of weakly selected allele\npposH::Float64: probability of strong selected allele\nobservedData::Array{Any,1}: Array containing the total observed divergence, polymorphism and site frequency spectrum.\nnopos::String(\"pos\",\"nopos\",\"both\"): string to perform α(x) account or not for both positive selective alleles.\n\nReturns\n\nTuple{Array{Float64,1},Array{Float64,2}} containing α(x) and the summary statistics array (Ds,Dn,Ps,Pn,α).\n\n\n\n\n\n","category":"function"},{"location":"reference/#Inference-tools-1","page":"Reference","title":"Inference tools","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Analytical.parseSfs\nAnalytical.ABCreg\nAnalytical.meanQ","category":"page"},{"location":"reference/#Analytical.parseSfs","page":"Reference","title":"Analytical.parseSfs","text":"parseSfs(;data,output,sfsColumns,divColumns)\n\nFunction to parse polymorphism and divergence by subset of genes. The input data is based on supplementary material described at Uricchio et al. 2019.\n\nGeneId Pn DAF seppareted by commas Ps DAF separated by commas Dn Ds\nXXXX 0 ,0,0,0,0,0,0,0,0 0 ,0,0,0,0,0,0,0,0 0 0\nXXXX 0 ,0,0,0,0,0,0,0,0 0 ,0,0,0,0,0,0,0,0 0 0\nXXXX 0 ,0,0,0,0,0,0,0,0 0 ,0,0,0,0,0,0,0,0 0 0\n\nArguments\n\ndata: String or Array of strings containing files names with full path.\noutput::String: path to save file. Containing one file per input file.\nsfsColumns::Array{Int64,1}: non-synonymous and synonymous daf columns. Please introduce first the non-synonymous number.\ndivColumns::Array{Int64,1}: non-synonymous and synonymous divergence columns. Please introduce first the non-synonymous number.\n\nReturns\n\nArray{Array{Int64,N} where N,1}: Array of arrays containing the total polymorphic sites (1), total Site Frequency Spectrum (2) and total divergence (3). Each array contains one row/column per file.\nFile writed in output\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.ABCreg","page":"Reference","title":"Analytical.ABCreg","text":"ABCreg(data, prior, nparams, nsummaries, outputPath, outputPrefix,tolerance, regressionMode,regPath)\n\nJulia to execute ABCreg. You should take into account that any other ABC could be used once the prior distributions are done. If you consider to use ABCreg please cite the publication and compile it in your system.\n\nArguments\n\ndata::String: Observed data. Produced by parseSfs.\noutput::String: path to save file. ABCreg will produce one file per lines inside data.\nnparams::Int64: number of parameters in prior distributions.\nnsummaries::Int64: number of observed summary statistics.\noutputPath::String: output path.\noutputPrefix::String: output prefix name.\ntolerance::Float64: tolerance for rejection acceptance in Euclidian distance.\nregressionMode::String: transformation (T or L).\n\nReturns\n\nArray{Array{Int64,N} where N,1}: Array of arrays containing the total polymorphic sites (1), total Site Frequency Spectrum (2) and total divergence (3). Each array contains one row/column per file.\nFile writed in output\n\n\n\n\n\n\n","category":"function"},{"location":"reference/#Analytical.meanQ","page":"Reference","title":"Analytical.meanQ","text":"meanQ(x,columns)\n\nFunction to retrieve mean and quantiles (95%) from posterior distributions.\n\nArguments\n\nx::Array{Float64,2}: posterior distribution.\ncolumns::Array{Int64,1}: columns to process.\n\nReturns\n\nArray{Array{Float64,2},1}: Array of array containing mean and quantiles by posterior distribution. Each array contains $\\alpha_{S}$, $\\alpha_{W}$ and $\\alpha$ information by column.\n\n\n\n\n\n","category":"function"},{"location":"abc/#*ABC*-inference-from-empirical-data-1","page":"ABC inference","title":"ABC inference from empirical data","text":"","category":"section"},{"location":"abc/#Prior-distributions-from-analytical-estimations-1","page":"ABC inference","title":"Prior distributions from analytical estimations","text":"","category":"section"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"In this example we provide a solution to replicate results at Uricchio et al. 2019. We will simulate 10^6 summary statistics from random DFE to use as prior distribution in ABCreg. In this case we will need a set of empirical observed values in order to subset the summary statistics.","category":"page"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"We need to set the model accounting for the sampling value. The SFS is expected to be in raw frequencies. If the model is not properly set up, the SFS will not be correctly parsed. In our case, we are going to set up a model with default parameters only to parse the SFS and convolute the observed frequencies with a binomial distribution.","category":"page"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"Analytical.changeParameters(N=1000,n=661,convoluteBinomial=true)","category":"page"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"Once the model account for the number of samples we can open the files. The function Analytical.parseSfs will return polymorphic and divergent counts and SFS accounting for the whole spectrum: collect(1:adap.nn)/adap.nn. In addition an output file will be created contained the observed values to input in ABCreg.","category":"page"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"path= \"/home/jmurga/mktest/data/\";suffix=\"txt\";\nfiles = path .* filter(x -> occursin(suffix,x), readdir(path))\n\nempiricalValues = Analytical.parseSfs(data=files,output=\"testData.tsv\",sfsColumns=[3,5],divColumns=[6,7])","category":"page"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"We make a function to perform 10^6 simulated values. We solve the analytical approximation taking into account random and independent values to draw DFE and alpha_(x). Each parameter combination are replicated to 5% frequency bins background selection values (saved at adap.bRange). ","category":"page"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"In Julia you can easily parallelize a loop using $ export JULIA_NUM_THREADS=8. Each iteration will be executed in a thread. In order to check the threads configured, just use in the julia console julia> Threads.nthreads() before the execution. We compute this example in a Intel i7-7700HQ (8) @ 3.800GHz laptop with 16GB of RAM using 8 threads. Please check parallelization manual in order to send the process in a multicore system (or just put two process manually the alphaSumStats.jl , a script provided to launch from command line).","category":"page"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"function summStats(iter,data)\n#@threads\n\t@showprogress for i in 1:iter\n\t\tgam_neg   = -rand(80:400)\n\t\tgL        = rand(10:20)\n\t\tgH        = rand(200:500)\n\t\talLow     = rand(collect(0.0:0.1:0.2))\n\t\talTot     = rand(collect(0.0:0.05:0.2))\n\n\t\tfor j in adap.bRange\n\t\t\tAnalytical.changeParameters(\n\t\t\t\tgam_neg             = gam_neg,\n\t\t\t\tgL                  = gL,\n\t\t\t\tgH                  = gH,\n\t\t\t\talLow               = alLow,\n\t\t\t\talTot               = alTot,\n\t\t\t\ttheta_f             = 1e-3,\n\t\t\t\ttheta_mid_neutral   = 1e-3,\n\t\t\t\tal                  = 0.184,\n\t\t\t\tbe                  = 0.000402,\n\t\t\t\tB                   = j,\n\t\t\t\tbRange              = adap.bRange,\n\t\t\t\tpposL               = 0.001,\n\t\t\t\tpposH               = 0.0,\n\t\t\t\tN                   = 1000,\n\t\t\t\tn                   = 661,\n\t\t\t\tLf                  = 10^6,\n\t\t\t\trho                 = 0.001,\n\t\t\t\tTE                  = 5.0,\n\t\t\t\tconvoluteBinomial   = false\n\t\t\t)\n\n\t\t\tAnalytical.set_theta_f()\n\t\t\ttheta_f        = adap.theta_f\n\t\t\tadap.B         = 0.999\n\t\t\tAnalytical.set_theta_f()\n\t\t\tAnalytical.setPpos()\n\t\t\tadap.theta_f   = theta_f\n\t\t\tadap.B         = j\n\n\t\t\tx,y,z          = Analytical.alphaByFrequencies(gammaL=adap.gL,gammaH=adap.gH,pposL=adap.pposL,pposH=adap.pposH,observedData=data)\n\t\t\tAnalytical.summaryStatistics(\"/home/jmurga/prior.csv\", z)\n\t\tend\n\tend\nend\n\n# Launch 10^6 solutions\n@time summStats(58824,empiricalValues)","category":"page"},{"location":"abc/#*ABC*-inference-1","page":"ABC inference","title":"ABC inference","text":"","category":"section"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"Generic ABC methods proceed by three main steps: (1) first sampling parameter values from prior distributions, (2) next simulating a model and calculating informative summary statistics, and lastly (3) comparing the simulated summary statistics to observed data. The parameter values that produce summary statistics that best match the observed data form an approximate posterior distribution. We link Julia with ABCreg. It will output one file per line in data. The files contain the posterior distributions. We return the posterior distributions, mean and quantiles.","category":"page"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"posteriors, results  = Analytical.ABCreg(data=\"/home/jmurga/data.tsv\",prior=\"/home/jmurga/prior.tsv\", nparams=27, nsummaries=24, outputPath=\"/home/jmurga/\", outputPrefix=\"outPaper\", tolerance=0.001, regressionMode=\"T\",regPath=\"/home/jmurga/ABCreg/src/reg\")","category":"page"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"You can easily plot the posterior distributions using Julia or just input the files at your favorite plot software.","category":"page"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"using Plots, Plots.PlotMeasures, StatsPlots, LaTeXStrings\n\nfunction plotPosterior(data,file,imgSize)\n\n\tPlots.gr()\n\tPlots.theme(:wong2)\n\n\tp1 = StatsPlots.density(data],\n\t\t\t\t\t\t\tlegend    = :topright,\n\t\t\t\t\t\t\tfill      = (0, 0.3),\n\t\t\t\t\t\t\txlabel    = L\"\\alpha\",\n\t\t\t\t\t\t\tlabel     = [L\"\\alpha_S\" L\"\\alpha_W\" L\"\\alpha\"],\n\t\t\t\t\t\t\tylabel    = \"Posterior density\",\n\t\t\t\t\t\t\tlw        = 0.5,\n\t\t\t\t\t\t\tfmt       = :svg,\n\t\t\t\t\t\t\tsize      = imgSize\n\t\t\t\t\t\t)\n\tPlots.savefig(file)\n\n\treturn p1\nend\n\np = plotPosterior(posterior[1],\"/home/jmurga/posterior1.svg\",(800,600))","category":"page"},{"location":"abc/#","page":"ABC inference","title":"ABC inference","text":"(Image: NBViewer)","category":"page"},{"location":"#ABC-MK-1","page":"Home","title":"ABC-MK","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"ABC-MK is an analytical approximation to alpha_(x). We explore the impact of linkage and background selection at positive selected alleles sites. The package solves anylitical approximations for different genetic scenarios in order to estimate the strenght and rate of adaptation. ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"When empircal values of polymorphims and divergence are given, they will be used to discern their expected correspoding values modeled under any Distribution of Fitness Effect (DFE) and background selection values (B). ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Our approach estimates directly alpha_(x) and several statistics (P_N, P_S, D_N, D_S, SFS, alpha_W, alpha_S) associated to random DFE.  In conjunction, the associated values to these DFE can be used as priors distributions at ABC methods. If we subset enough parameters, we will consider any frequency spectrum and fixations under generalized models of selection, demography, and linkage associated with the empirical population and sample size. Therefore, our method can estimate rate and strength of adaption in models and non-models organisms, for which previous DFE and demography are unknown.","category":"page"},{"location":"#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"To install our module we highly recommend to use LTS official Julia binaries. If is your first time using Julia, you can easily export the Julia bin through export PATH=\"/path/to/directory/julia-1.v.v/bin:$PATH\" in your shell. Since we use scipy to solve equations, the package depends on PyCall.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia -e 'using Pkg;Pkg.add(PackageSpec(path=\"https://github.com/jmurga/Analytical.jl\"))'","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Or from Pkg REPL (by pressing ] at Julia interpreter):","category":"page"},{"location":"#","page":"Home","title":"Home","text":"add https://github.com/jmurga/Analytical.jl","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Scipy installation  ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"You can install scipy on your default Python or install it through Julia Conda:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia -e 'using Pkg;Pkg.add(\"PyCall\");using PyCall;pyimport_conda(\"scipy.optimize\", \"scipy\")'","category":"page"},{"location":"#","page":"Home","title":"Home","text":"If you cannot install properly scipy through Julia Conda try the following:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Set an empty Python enviroment and re-build PyCall: ENV[\"PYTHON\"]=\"\";  Pkg.build(\"PyCall\")\nRe-launch Julia and install the scipy.optimize module: using PyCall;pyimport_conda(\"scipy.optimize\", \"scipy)","category":"page"},{"location":"#Docker-1","page":"Home","title":"Docker","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"We provide a Docker image based on Debian including Julia and Jupyter notebook. You can access to Debian system or just to Jupyter pulling the image from dockerhub. Remember to link the folder /analysis with any folder at your home to save the results:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"# Pull the image\ndocker pull jmurga/mktest\n# Run docker bash interactive session linking to some local volume to export data. \ndocker run -i -t -v ${HOME}/folderPath:/analysis/folder  jmurga/mktest\n# Run only jupyter notebook from docker image. Change the port if 8888 is already used\ndocker run -i -t -v ${HOME}/folderPath:/analysis/folder -p 8888:8888 jmurga/mktest /bin/bash -c \"jupyter-lab --ip='*' --port=8888 --no-browser --allow-root\"","category":"page"},{"location":"#Dependencies-1","page":"Home","title":"Dependencies","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"All the dependecies are installed within the package. You don't need to install manually. If you experiment any problem contact us or try to reinstall Pycall and scipy.","category":"page"},{"location":"#Mandatory-dependencies-to-solve-the-analytical-equations-1","page":"Home","title":"Mandatory dependencies to solve the analytical equations","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Roots - root finding.\nDistributions - probability distributions.\nPyCall - directly call and fully interoperate with Python.\nSpecialFunctions - special mathematical functions in Julia.\nParameters - custom keyword constructor.","category":"page"},{"location":"#The-following-dependencies-are-required-to-use-all-the-funcionalities-(parse-SFS,-plots,-etc.)-1","page":"Home","title":"The following dependencies are required to use all the funcionalities (parse SFS, plots, etc.)","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"CSV\nParsers\nStatsBase\nDataFrames\nGZip","category":"page"},{"location":"#*ABC*-1","page":"Home","title":"ABC","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"We link ABCreg with Julia in order to perform ABC estimations. If you are going to use ABCreg to do inference please cite the publication and compile it in your system. Anyway, once you get the priors distributions you can use any other ABC software.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"git clone https://github.com/molpopgen/ABCreg.git\ncd ABCreg/src && make","category":"page"},{"location":"#References-1","page":"Home","title":"References","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Uricchio, L.H., Petrov, D.A. & Enard, D. Exploiting selection at linked sites to infer the rate and strength of adaptation. Nat Ecol Evol 3, 977–984 (2019). https://doi.org/10.1038/s41559-019-0890-6\nPhilipp W. Messer, Dmitri A. Petrov. Frequent adaptation and the McDonald–Kreitman test. Proceedings of the National Academy of Sciences May 2013, 110 (21) 8615-8620. https://doi.org/10.1073/pnas.1220835110\nNordborg, M., Charlesworth, B., & Charlesworth, D. (1996). The effect of recombination on background selection. Genetical Research, 67(2), 159-174. https://doi.org/10.1017/S0016672300033619\nR R Hudson and N L Kaplan. Deleterious background selection with recombination. Genetics December 1, 1995 vol. 141 no. 4 1605-1617.\nLinkage and the limits to natural selection. N H Barton. Genetics June 1, 1995 vol. 140 no. 2 821-841\nThornton, K.R. Automating approximate Bayesian computation by local linear regression. BMC Genet 10, 35 (2009). https://doi.org/10.1186/1471-2156-10-35","category":"page"}]
}