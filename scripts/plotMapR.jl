using RCall, CSV, DataFrames, GZip

"""
	Estimating and plotting MAP using locfit and ggplot2 in R. It assume your folder contains the posterior estimated through ABCreg
"""
function plotMap(;analysis::String,output::String,weak::Bool=true,title::String="Posteriors")

	try
		@eval using RCall
		@eval R"""library(ggplot2);library(abc)"""

		out          = filter(x -> occursin("post",x), readdir(analysis,join=true))
		out          = filter(x -> !occursin(".1.",x),out)

		open(x)      = Array(CSV.read(GZip.open(x),DataFrame,header=false))

		# Control outlier inference. 2Nes non negative values
		flt(x)       = x[x[:,4] .> 0,:]
		posteriors   = flt.(open.(out))

		R"""getmap <- function(df){
				temp = as.data.frame(df)
				d <-locfit(~temp[,1],temp);
				map<-temp[,1][which.max(predict(d,newdata=temp))]
			}"""
		getmap(x)    = rcopy(R"""matrix(apply($x,2,getmap),nrow=1)""")

		if !weak
			posteriors = [posteriors[i][:,3:end] for i in eachindex(posteriors)]
			tmp          = getmap.(posteriors)
			maxp         = DataFrame(vcat(tmp...),[:a,:gamNeg,:shape])
			al           = maxp[:,1:1]
			gam          = maxp[:,2:end]
		else
			tmp          = getmap.(posteriors)
			maxp         = DataFrame(vcat(tmp...),[:aw,:as,:a,:gamNeg,:shape])
			al           = maxp[:,1:3]
			gam          = maxp[:,4:end]
		end

		p = rcopy(R"""al = $al
			lbls = if(ncol(al) > 1){c(expression(paste('Posterior ',alpha[w])), expression(paste('Posterior ',alpha[s])),expression(paste('Posterior ',alpha)))}else{c(expression(paste('Posterior ',alpha)))}
			clrs = if(ncol(al) > 1){c('#30504f', '#e2bd9a', '#ab2710')}else{c('#ab2710')}


			dal = melt(al)
			pal = ggplot(dal) + geom_density(aes(x=value,fill=variable),alpha=0.7) + scale_fill_manual('Posterior distribution',values=clrs ,labels=lbls) + theme_bw() + ggtitle($title) + xlab(expression(alpha)) + ylab("")
			ggsave(pal,filename=paste0($output))
			""")
		return(maxp)
	catch
		println("Please install R, ggplot2 and abc in your system before execute this function")
	end
end