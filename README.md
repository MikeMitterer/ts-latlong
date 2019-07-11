# LatLong - Lightweight library for common latitude and longitude calculation
> [Live-Example](#) | [GitHub-Home](https://github.com/MikeMitterer/ts-latlong)

This library supports both, the "Haversine" and the "Vincenty" algorithm.

"Haversine" is a bit faster but "Vincenty" is far more accurate!
 
<p align="center"> 
    <img alt="LatLong" src="https://github.com/MikeMitterer/ts-latlong/raw/master/doc/images/latlong.jpg"> 
</p>

[Catmull-Rom algorithm](http://hawkesy.blogspot.co.at/2010/05/catmull-rom-spline-curve-implementation.html) is used for smoothing out the path.

## Basic usage 

### Distance
```typescript
    const distance = new Distance();
    
    // km = 423
    const km = distance.as(LengthUnit.Kilometer,
     new LatLng(52.518611,13.408056),new LatLng(51.519475,7.46694444));
    
    // meter = 422591.551
    const meter = distance.distance(
        new LatLng(52.518611,13.408056),
        new LatLng(51.519475,7.46694444)
        );

```

## Offset
```typescript
    const distance = new Distance();
    const distanceInMeter = Math.round(EARTH_RADIUS * Math.PI / 4));
    
    const p1 = new LatLng(0.0, 0.0);
    const p2 = distance.offset(p1, distanceInMeter, 180);
    
    // LatLng(latitude:-45.219848, longitude:0.0)
    console.log(p2.round());
    
    // 45° 13' 11.45" S, 0° 0' 0.00" O
    console.log(p2.toSexagesimal());
            
```

## Path smoothing
```typescript
    // zigzag is a list of coordinates
    const path = new Path.from(zigzag);
    
    // Result is below
    const steps = path.equalize(8,smoothPath: true);
```
<p align="center"> 
    <img alt="Smooth path" src="https://github.com/MikeMitterer/ts-latlong/raw/master/doc/images/smooth-path.jpg">
</p>

For more - check out my tests







