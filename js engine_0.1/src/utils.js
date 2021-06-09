class Vector2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    static Zero()
    {
        return new Vector2(0, 0);
    }

    Set(x, y)
    {
        this.x = x;
        this.y = y;
    }

    Length()
    {
        const x2 = this.x * this.x;
        const y2 = this.y * this.y;
        return Math.sqrt(x2 + y2);
    }

    Normalize()
    {
        const length = this.Length();

        if (length > 0)
        {
            this.x = this.x / length;
            this.y = this.y / length;
        }
    }

    Add(otherVector)
    {
        this.x += otherVector.x;
        this.y += otherVector.y;
    }

    Sub(otherVector)
    {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
    }

    DotProduct(otherVector)
    {
        return this.x * otherVector.x + this.y * otherVector.y;
    }

    MultiplyScalar(scalar)
    {
        this.x *= scalar;
        this.y *= scalar;
    }

    AngleBetween(otherVector)
    {
        // vec1 and vec2 should be normalized

        // a · b = |a| × |b| × cos(θ)
        // cos(θ) = (a · b) / |a| × |b|
        // θ = arccos[(a · b) / |a| × |b|]
        // si a y b son unitarios: θ = arccos(a · b)
        const dotProduct = this.DotProduct(otherVector);
        return Math.acos(dotProduct);
    }

    Random()
    {
        this.x = (Math.random() * 2) - 1;
        this.y = (Math.random() * 2) - 1;
    }

    RandomNormalized()
    {
        this.Random();
        this.Normalize();
    }
}

function RandomRange(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min)
}

