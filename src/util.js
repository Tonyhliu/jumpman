
const Util = {
    randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    },

    randomColor( colors) {
        return colors[Math.floor(Math.random() * colors.length)]
    },

    distance (x1, y1, x2, y2) {
        const xDist = x2 - x1
        const yDist = y2 - y1
        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
    },

    wrap(x, max) {
        if (x < 0) {
            return max - (x % max);
        } else if (x > max) {
            return x % max;
        } else {
            return x;
        }
    },
    
}

export default Util;
