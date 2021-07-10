import { LightningElement, track } from 'lwc';
import retriveWeatherData from '@salesforce/apex/WeatherDetail.retriveWeatherData';

const weekName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday','Sunday']
const monthName = ['January', 'February','March', 'April','May','June','July','August','September','October','November','December']
const ordinalNo = ['st','nd','rd','th','th','th','th','th','th','th',
                    'th','th','th','th','th','th','th','th','th','th',
                    'st','nd','rd','th','th','th','th','th','th','th','st']
export default class WeatherApp extends LightningElement {

    @track cityName
    @track wDataMain
    @track wDataWind
    @track wDataRain
    @track wDataSys
    @track wDataDt
    @track wDataName
    @track wDataWeather
    @track showWeather = false

    temp
    feels_like
    temp_min
    temp_max
    pressure
    humidity
    wind
    rain
    sunrise
    sunset
    country_code = ''
    mDate
    description

    cityNameHandler(event){
        this.cityName = event.target.value;
    }

    clickHandler() {
        retriveWeatherData({ city: this.cityName }).then(response => {

            this.wDataMain = response.main
            this.wDataWind = response.wind
            this.wDataRain = response.rain
            this.wDataSys = response.sys
            this.wDataDt = response.dt
            this.wDataName = response.name
            this.wDataWeather = response.weather[0]

            this.formateDataMain(this.wDataMain)
            this.formateDataWind(this.wDataWind)
            this.formateDataRain(this.wDataRain)
            this.formateDataTime(this.wDataSys)
            this.formateDataDate(this.wDataDt)
            this.formateDataWeather(this.wDataWeather)
            this.showWeather = true

            
        }).catch(error => {
            this.showWeather = false
            console.error(error)
        })
    }

    formateDataMain(data) {
        this.temp = this.kelvinToCelsius(data.temp)
        this.feels_like = this.kelvinToCelsius(data.feels_like)
        this.temp_min = this.kelvinToCelsius(data.temp_min)
        this.temp_max = this.kelvinToCelsius(data.temp_max)
    }

    formateDataWind(data){
        this.wind = data.speed
    }

    formateDataRain(data){

        if(data != undefined){
            if((data['1h'] != undefined) || (data['1h'] > data['3h'])){
                this.rain = data['1h']
            }else if(data['3h'] != undefined || (data['1h'] < data['3h'])){
                this.rain = data['3h']
            }
        }else{
            this.rain = 0
        }
        
    }

    formateDataTime(data){
        this.sunrise = this.timeFormat(data.sunrise)
        this.sunset = this.timeFormat(data.sunset)
        this.country_code = data.country
    }
    
    formateDataDate(data){
        var tempDate =  new Date(data * 1000)
        this.mDate = `${weekName[tempDate.getDay() - 1]}, ${tempDate.getDate()}${ordinalNo[tempDate.getDate()]} ${monthName[tempDate.getMonth()]} ${tempDate.getFullYear()}`
    }

    formateDataWeather(data){
        this.description = data.description
    }

    kelvinToCelsius(tempK) {
        return (Math.round((tempK - 273.15) * 10) / 10)
    }

    timeFormat(epochDate){
        var myDate = new Date( epochDate * 1000)
        var time = `${myDate.getHours()} : ${myDate.getMinutes()}`

        return time
    }


}

// "main": {
//     "temp": 304.12,
//     "feels_like": 311.12,
//     "temp_min": 304.12,
//     "temp_max": 304.12,
//     "pressure": 999,
//     "humidity": 89
//     },