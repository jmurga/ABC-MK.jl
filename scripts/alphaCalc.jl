using Analytical, ProgressMeter

# Set up sfs
Analytical.changeParameters(N=700,n=661,diploid=true,convoluteBinomial=true)

# Open empirical data
path= "/home/jmurga/mktest/data/";suffix="txt";
files = path .* filter(x -> occursin(suffix,x), readdir(path))

empiricalValues = Analytical.parseSfs(data=files,output="/home/jmurga/data.tsv",sfsColumns=[3,5],divColumns=[6,7])

# Custom function to perform 10^6 random solutions
function summStats(iter::Int64,data::Array,output::String)
	# @threads
	# @showprogress for i in 1:iter
	for i in 1:iter
		
		gam_neg=-rand(80:400)
		gL=rand(10:20)
		gH=rand(300:500)
		alLow=rand(collect(0.0:0.05:0.2))
		alTot=rand(collect(0.05:0.05:0.4))

		for j in adap.bRange
		# j=0.3
			Analytical.changeParameters(gam_neg=gam_neg,gL=gL,gH=gH,alLow=alLow,alTot=alTot,theta_f=1e-3,theta_mid_neutral=1e-3,al=0.184,be=0.000402,B=j,bRange=adap.bRange,pposL=0.001,pposH=0.0,N=700,n=661,Lf=10^6,rho=adap.rho,TE=5.0,diploid=true,convoluteBinomial=false)

			Analytical.set_theta_f()
			theta_f = adap.theta_f
			adap.B = 0.999
			Analytical.set_theta_f()
			Analytical.setPpos()
			adap.theta_f = theta_f
			adap.B = j

			x,y,z= Analytical.alphaByFrequencies(gammaL=adap.gL,gammaH=adap.gH,pposL=adap.pposL,pposH=adap.pposH,observedData=data)

			Analytical.summaryStatistics(output, z)
			
		end
	end
end

summStats(10,empiricalValues,"/home/jmurga/prior.tsv")
