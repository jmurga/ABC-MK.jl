using Analytical, ProgressMeter

# Set up sfs
Analytical.changeParameters(N=1000,n=661,diploid=true,convoluteBinomial=true)

# # Open empirical data
path= "/home/jmurga/mktest/data/";suffix="txt";
files = path .* filter(x -> occursin(suffix,x), readdir(path))

empiricalValues = Analytical.parseSfs(data=files,output="/home/jmurga/dataFifty",sfsColumns=[3,5],divColumns=[6,7],bins=50)

# # Custom function to perform 10^6 random solutions
function summStats(iter::Int64,data::Array,output::String,b::Int64)
	# @threads
	@showprogress for i in 1:iter
	# for i in 1:iter

		alTot=rand(collect(0.0:0.05:0.4))	
		alLow=rand(collect(0.0:0.05:alTot))
		
		gam_neg   = -457
		gL        = rand(10:40)
		gH        = rand(300:500)

		fac       = rand(-2:0.05:2)
		afac      = 0.184*(2^fac)
		bfac      = 0.000402*(2^fac)

		alTot     = rand(collect(0.05:0.05:0.4))
		alLow     = rand(collect(0.0:0.05:alTot))
		
		for j in adap.bRange
		# j = 0.999

			Analytical.changeParameters(gam_neg=gam_neg,gL=gL,gH=gH,alLow=alLow,alTot=alTot,theta_f=1e-3,theta_mid_neutral=1e-3,al=afac,be=bfac,B=j,bRange=adap.bRange,pposL=0.001,pposH=0.0,N=1000,n=661,Lf=10^6,rho=adap.rho,TE=5.0,diploid=true,convoluteBinomial=false)

			Analytical.set_theta_f()
			theta_f = adap.theta_f
			adap.B = 0.999
			Analytical.set_theta_f()
			Analytical.setPpos()
			adap.theta_f = theta_f
			adap.B = j
			x,y,z = Analytical.alphaByFrequencies(gammaL=adap.gL,gammaH=adap.gH,pposL=adap.pposL,pposH=adap.pposH,observedData=data,bins=b)
			
			Analytical.summaryStatistics(output, z)

		end
	end
end

summStats(1,empiricalValues,"/home/jmurga/priorFifty",50)
summStats(117648,empiricalValues,"/home/jmurga/priorFifty",50)

# using Plots, Plots.PlotMeasures, StatsPlots, LaTeXStrings, ProgressMeter, BenchmarkTools, DataFrames

# function plotPosterior(data,imgSize)

#     Plots.gr()
#     Plots.theme(:wong2)

#     p1 = StatsPlots.density(data,
#                             legend = :topleft,
#                             fill=(0, 0.75),
#                             linecolor=["#30504f" "#e2bd9a" "#ab2710"],
#                             #linecolor=["#E1B16A" "#31A2AC" "#F62A00"],
#                             fillcolor=["#30504f" "#e2bd9a" "#ab2710"],
#                             xlabel = L"\alpha",
#                             label = [L"\alpha_S" L"\alpha_W" L"\alpha"],
#                             ylabel = "Posterior density",
#                             lw = 2,
#                             fmt = :svg,
#                             size=imgSize,
#                         )
#     return p1
# end

# posteriorAll, resultAll = Analytical.ABCreg(data="/home/jmurga/dataAbc/dataAll.gz",prior="/home/jmurga/dataAbc/priorAll.gz", nparams=3, nsummaries=24, outputPath="/home/jmurga/dataAbc/", outputPrefix="all", tolerance=0.00025, regressionMode="T",regPath="/home/jmurga/ABCreg/src/reg")

# plotPosterior(posteriorAll[1],(600,400))

# posteriorVip, resultVip = Analytical.ABCreg(data="/home/jmurga/dataAbc/dataVip.gz",prior="/home/jmurga/dataAbc/priorVip.gz", nparams=3, nsummaries=24, outputPath="/home/jmurga/dataAbc/", outputPrefix="vip", tolerance=0.001, regressionMode="T",regPath="/home/jmurga/ABCreg/src/reg")

# plotPosterior(posteriorVip[1],(600,400))
