public with sharing class WeatherDetail {
    
    @AuraEnabled
    public static Map<String,Object> retriveWeatherData(String city){

        String cityName = city.replace(' ','+');
        String apiKey = 'replace_it_with_your_own__ you_can_get from_openweatherAPI_website.__Its_free_😀';
        String url = 'http://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+apikey;
        //String url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=700103&date=09-07-2021';
        
        System.debug(url);
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('GET');

        Map<String,Object> weatherData = new Map<String,Object>();
        String result = null;

        try{
            Http http = new Http();
            HttpResponse response = http.send(request);

            System.debug(response.getStatusCode());

            if(response.getStatusCode() == 200){
                result = response.getBody();
            }else{
                throw new CalloutException(response.getBody());
            }
        }catch(Exception e){

            throw e;
        }

        if(!String.isBlank(result)){
            weatherData = (Map<String,Object>)JSON.deserializeUntyped(result);
        }

        if(!weatherData.isEmpty()){
            //System.debug(weatherData);
            return weatherData;
        }else{
            return null;
        }
    }
}
