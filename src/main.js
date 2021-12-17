// taken from Yahoo Finance page using
// JSON.stringify([...document.querySelectorAll('td')].map(r => r.textContent))
// in console
const priceDataRaw = ["Dec 14, 2021","122.35","125.03","122.30","123.76","123.76","5,716,100","Dec 13, 2021","123.76","124.36","120.79","122.58","122.58","6,847,500","Dec 10, 2021","124.30","125.33","123.36","124.09","124.09","4,965,300","Dec 09, 2021","122.15","123.95","121.79","123.57","123.57","4,601,100","Dec 08, 2021","122.00","123.38","121.52","123.02","123.02","5,483,900","Dec 07, 2021","120.48","122.08","120.07","121.58","121.58","5,194,000","Dec 06, 2021","119.40","121.15","119.40","119.91","119.91","4,785,600","Dec 03, 2021","117.36","119.36","117.36","118.84","118.84","6,629,200","Dec 02, 2021","117.37","117.98","116.56","116.90","116.90","5,267,100","Dec 01, 2021","118.25","118.93","116.85","116.92","116.92","5,958,300","Nov 30, 2021","117.50","119.24","116.45","117.10","117.10","9,252,700","Nov 29, 2021","118.62","119.61","117.53","118.50","118.50","8,949,800","Nov 26, 2021","115.00","116.34","114.56","115.81","115.81","3,322,000","Nov 24, 2021","116.16","117.27","116.08","116.73","116.73","3,220,800","Nov 23, 2021","116.79","117.94","116.04","116.79","116.79","4,912,800","Nov 22, 2021","116.00","118.81","115.19","116.47","116.47","6,416,200","Nov 19, 2021","116.49","116.56","115.27","116.05","116.05","5,380,200","Nov 18, 2021","118.36","118.36","116.31","116.66","116.66","5,046,900","Nov 17, 2021","118.38","119.33","117.78","118.06","118.06","4,043,300","Nov 16, 2021","118.92","119.90","118.42","118.46","118.46","4,750,800","Nov 15, 2021","119.54","120.16","118.31","118.87","118.87","5,046,300","Nov 12, 2021","120.00","120.64","118.78","118.96","118.96","5,414,800","Nov 11, 2021","120.90","121.79","120.08","120.27","120.27","4,643,300","Nov 10, 2021","121.00","122.43","119.93","120.22","120.22","6,270,300","Nov 09, 2021","122.56","122.90","120.26","120.85","120.85","7,236,600","Nov 08, 2021","123.99","124.78","123.53","124.54","122.90","5,625,300","Nov 05, 2021","121.43","123.77","121.43","123.61","121.98","6,786,500","Nov 04, 2021","123.05","123.34","119.90","120.85","119.26","7,208,700","Nov 03, 2021","120.68","121.69","120.15","121.54","119.94","5,670,784","Nov 02, 2021","120.75","121.58","119.42","120.63","119.04","4,722,062","Nov 01, 2021","119.55","120.76","118.39","120.73","119.14","6,177,153","Oct 29, 2021","119.91","120.76","119.42","119.60","118.02","6,188,973","Oct 28, 2021","119.67","120.76","119.14","120.31","118.72","6,802,138","Oct 27, 2021","121.84","122.26","119.51","119.67","118.09","7,294,176","Oct 26, 2021","121.91","122.66","121.19","121.54","119.94","8,912,861","Oct 25, 2021","121.92","122.99","121.36","122.03","120.42","6,667,204","Oct 22, 2021","122.42","124.52","121.04","122.26","120.65","12,114,981","Oct 21, 2021","127.64","127.84","122.47","122.69","121.07","32,913,959","Oct 20, 2021","135.45","135.95","134.51","135.66","133.87","6,474,008","Oct 19, 2021","134.88","136.65","134.34","135.74","133.95","4,539,117"]


//extract date and closing prices as separate arrays
const getDateClose = (rawData) => {
    const dates = []
    const closePrices = []

    for (let i = 0; i < rawData.length; i+=7){
        dates.push(rawData[i])
        closePrices.push(Number(rawData[i+4]))
    }

    return {dates, closePrices}
}

//takes 40 days of closing prices data, returns 20 day moving avg
const getAverages = (data) => {
    let averages = []
    
    for(let i = 0; i < 20; i++){
        const period = data.slice(i, i+20)
        const periodSum = period.reduce((x, y) => x + y, 0)

        averages.unshift((periodSum/20).toFixed(2))
    }

    return averages
}

//helper function to easily create canvas context across functions
const createContext = () => {
    const canvas = document.getElementById('avgChart')
    const ctx = canvas.getContext("2d")
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.font = "10px Arial"

    return ctx
}

//create X-axis info at top of canvas
const drawDailyInfo = (datesInfo) => {
    const dates = datesInfo.dates
    const prices = datesInfo.closePrices
    const ctx = createContext()

    ctx.fillText("Date",0,10,35)
    ctx.fillText("Close",0,20,35)

    let xIndex = 50
    for(let i = 19; i >= 0; i--){
        ctx.fillText(dates[i],xIndex,10,48)
        ctx.fillText(prices[i],xIndex,20, 48)
        xIndex+=50
    }
    ctx.moveTo(0,25)
    ctx.lineTo(1050,25)
    ctx.stroke()
}

//create Y-axis info at left of canvas
const drawClosingInfo = (avgArr) => {
    const highPrice = Math.max(...avgArr)
    const lowPrice = Math.min(...avgArr)
    const priceInc = ((highPrice - lowPrice)/10).toFixed(2)
    const ctx = createContext()

    let i = highPrice
    let yIndex = 40
    while(i >= lowPrice){
        ctx.moveTo(40, yIndex)
        ctx.lineTo(44, yIndex)
        ctx.stroke()
        ctx.fillText(i,0,yIndex,35)
        i=(i-priceInc).toFixed(2)
        yIndex+=50
    }
    ctx.moveTo(40,0)
    ctx.lineTo(40,520)
    ctx.stroke()
}

//get line coordinates relative to canvas
const findYIndex = (x, high, low) => {
    return (((x - low) / (high - low)) * 450) + 40
}

//create moving avg line
const drawMALine = (avgArr) => {
    const ctx = createContext()
    const high = Math.max(...avgArr)
    const low = Math.min(...avgArr)

    let xIndex = 75
    let yIndex = findYIndex(avgArr[0],high,low)
    ctx.moveTo(xIndex, yIndex)
    for(let i = 1; i < avgArr.length; i++){
        xIndex+=50
        yIndex = findYIndex(avgArr[i],high,low)
        ctx.lineTo(xIndex, yIndex)
        ctx.stroke()
    }
}

const example = () => {
    const convData = getDateClose(priceDataRaw)
    const movingAvg = getAverages(convData.closePrices)
    drawDailyInfo(convData)
    drawClosingInfo(movingAvg)
    drawMALine(movingAvg)
}