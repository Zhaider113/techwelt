
const rearrangePointsForConvex = (points) => {
    // Find the leftmost point as the starting point
    let startPoint = points[0];
    for (let i = 1; i < points.length; i++) {
      if (points[i].longitude < startPoint.longitude) {
        startPoint = points[i];
      }
    }
  
    const rearrangedPoints = [startPoint];
    let currentPoint = startPoint;
  
    while (true) {
      let nextPoint = points[0];
      for (let i = 1; i < points.length; i++) {
        if (points[i] === currentPoint) continue;
  
        const orientation = getOrientation(currentPoint, nextPoint, points[i]);
        if (
          nextPoint === currentPoint ||
          orientation === 2 ||
          (orientation === 0 &&
            getDistance(currentPoint, points[i]) >
              getDistance(currentPoint, nextPoint))
        ) {
          nextPoint = points[i];
        }
      }
  
      if (nextPoint === startPoint) {
        break; // Reached the starting point, polygon is complete
      }
  
      rearrangedPoints.push(nextPoint);
      currentPoint = nextPoint;
    }
  
    return rearrangedPoints;
  };
  
  const getOrientation = (p, q, r) => {
    const val =
      (q.latitude - p.latitude) * (r.longitude - q.longitude) - (q.longitude - p.longitude) * (r.latitude - q.latitude);
  
    if (val === 0) {
      return 0; // Collinear
    }
  
    return val > 0 ? 1 : 2; // Clockwise or counterclockwise
  };
  
  const getDistance = (p1, p2) => {
    const dx = p2.longitude - p1.longitude;
    const dy = p2.latitude - p1.latitude;
    return dx * dx + dy * dy;
  };

  //////////////////////////////////////// dishtinguish convex or concave
  const isConvexPolygon = (points) => {
    const n = points.length;
    let positive = false;
    let negative = false;
  
    for (let i = 0; i < n; i++) {
      const current = points[i];
      const prev = points[(i + n - 1) % n];
      const next = points[(i + 1) % n];
  
      const crossProduct = calculateCrossProduct(prev, current, next);
  
      if (crossProduct > 0) {
        positive = true;
      } else if (crossProduct < 0) {
        negative = true;
      }
  
      if (positive && negative) {
        return false; // Polygon is concave
      }
    }
  
    return true; // Polygon is convex
  };
  
  const calculateCrossProduct = (p1, p2, p3) => {
    const vector1 = [p2.longitude - p1.longitude, p2.latitude - p1.latitude];
    const vector2 = [p3.longitude - p2.longitude, p3.latitude - p2.latitude];
  
    return vector1[0] * vector2[1] - vector1[1] * vector2[0];
  };
  


  //////////////////////////////////////// for concave
  const rearrangePointsForConcave = (points) => {
    const rearrangedPoints = [];
  
    // Sort points in clockwise order
    const center = getCenterPoint(points);
    points.sort((a, b) => {
      const angleA = Math.atan2(a.latitude - center.latitude, a.longitude - center.longitude);
      const angleB = Math.atan2(b.latitude - center.latitude, b.longitude - center.longitude);
      return angleA - angleB;
    });

    // Perform ear clipping
    let remainingPoints = [...points];

    while (remainingPoints.length > 2) {
      const m = remainingPoints.length;
      let earIndex = -1;

      for (let i = 0; i < m; i++) {
        const prevIndex = (i + m - 1) % m;
        const nextIndex = (i + 1) % m;

        const prevPoint = remainingPoints[prevIndex];
        const currentPoint = remainingPoints[i];
        const nextPoint = remainingPoints[nextIndex];

        if (isEar(prevPoint, currentPoint, nextPoint, remainingPoints)) {
          earIndex = i;
          break;
        }
      }

      if (earIndex === -1) {
        break; // No more ears found
      }

      const ear = remainingPoints[earIndex];
      rearrangedPoints.push(ear);

      remainingPoints.splice(earIndex, 1);
    }

    // Add the remaining points
    rearrangedPoints.push(...remainingPoints);

    return rearrangedPoints
    
  };
  
  const getCenterPoint = (points) => {
    const n = points.length;
    let centerX = 0;
    let centerY = 0;
  
    for (let i = 0; i < n; i++) {
      centerX += points[i].longitude;
      centerY += points[i].latitude;
    }
  
    centerX /= n;
    centerY /= n;
  
    return [centerX, centerY];
  };
  
  const isEar = (prev, current, next, points) => {
    const triangle = [prev, current, next];
  
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
  
      if (point === prev || point === current || point === next) {
        continue;
      }
  
      if (isPointInsideTriangle(point, triangle)) {
        return false;
      }
    }
  
    return true;
  };
  
  const isPointInsideTriangle = (point, triangle) => {
    const [p1, p2, p3] = triangle;

    const area = 0.5 * (-p2.latitude * p3.longitude + p1.latitude * (-p2.longitude + p3.longitude) + p1.longitude * (p2.latitude - p3.latitude) + p2.longitude * p3.latitude);
  
    const s = 1 / (2 * area) * (p1.latitude * p3.longitude - p1.longitude * p3.latitude + (p3.latitude - p1.latitude) * point.longitude + (p1.longitude - p3.longitude) * point.latitude);
    const t = 1 / (2 * area) * (p1.longitude * p2.latitude - p1.latitude * p2.longitude + (p1.latitude - p2.latitude) * point.longitude + (p2.longitude - p1.longitude) * point.latitude);
  
    return s >= 0 && t >= 0 && (1 - s - t) >= 0;
    // const [p1, p2, p3] = triangle;
  
    // const b1 = getOrientationConcave(p1, p2, point) < 0;
    // const b2 = getOrientationConcave(p2, p3, point) < 0;
    // const b3 = getOrientationConcave(p3, p1, point) < 0;
  
    // return (b1 === b2) && (b2 === b3);
  };
  
  const getOrientationConcave = (p, q, r) => {
    const val = (q.longitude - p.longitude) * (r.latitude - q.latitude) - (q.latitude - p.latitude) * (r.longitude - q.longitude);
    return Math.sign(val);
  };