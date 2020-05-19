using Documenter, Analytical


makedocs(
    modules  = [Analytical],    
    format = Documenter.HTML(),
    sitename="Analytical MK approach",
    authors = "Jesús Murga-Moreno, Lawrence Uricchio, David Enard",    
    pages    = [
        "Home" => "index.md",
        "Package overview" => "package.md",
        "Reference" => "reference.md"
    ]
)


deploydocs(
    repo = "github.com/jmurga/Analytical.jl.git"
)
