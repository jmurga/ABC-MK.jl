using Documenter, Analytical


makedocs(
    sitename="Analytical MK approach",
    authors = "Jesús Murga-Moreno, Lawrence Uricchio, David Enard",
    modules  = [Analytical],
    doctest  = false,
    pages    = [
        "index.md"
    ],
)


deploydocs(
    repo = "github.com/jmurga/Analytical.jl.git"
)
