import React from 'react';
import {
    StyleSheet,
    View,
    Button
} from 'react-native';
import HighchartsReactNative from '@highcharts/highcharts-react-native'
const axios=require('axios');



export default class ChartUI extends React.Component {
    constructor(props) {
        super(props);
        var chart = {
          zoomType: 'x'
       }; 
       var document = "document";
       var title = {
          text: ''   
       };
       var subtitle = {
          text: document.ontouchstart === undefined ?
          'Click and drag in the plot area to zoom in' :
          'Pinch the chart to zoom in'
       };
       var xAxis = {
          type: 'datetime',
          minRange: 100000 
       };
       var yAxis = {
          title: {
             text: 'Close Price'
          }
       };
       var legend = {
          enabled: false 
       };
       var plotOptions = {
          area: {
             fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                
             },

             stops: [
              [0,"#89BCEE"],
              [1,"#89BCEE"]
           ],
             marker: {
                radius: 2
             },
             lineWidth: 1,
             states: {
                hover: {
                   lineWidth: 1
                }
             },
             threshold: null
          }
       };
       var series = [{
          type: 'area',
          name: 'Price',
          pointInterval: 60000,
         
          data: [],
          
         
          
       }];
     
    

       var json = {};
       json.chart = chart;
       json.title = title;
       json.subtitle = subtitle;
       json.legend = legend;
       json.xAxis= xAxis;
       json.yAxis = yAxis;  
       json.series = series;
       json.plotOptions = plotOptions;
      
    
        this.state = {
            chartOptions: json,
            result:[],
            result2:[],
            result3:[],
            minRange: 50000 ,
            pointInterval:60000,
            data:[],
            title:'',
           
            pointStart1:'',
            pointStart2:'',
            pointStart3:'',

           

        };
    }
    componentDidMount(){

      
      

      axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=1min&apikey=M7ZA0AR7JAG5PXSG')
  .then((response) =>{
    //console.log(response['data']['Time Series (1min)']);
    var result=[];

    for (let x in response['data']['Time Series (1min)']) {
      var res=[];
      //console.log(response['data']['Time Series (1min)'][x]['4. close'])
      //console.log(x);
      
      res.push(x);
      res.push(parseFloat(response['data']['Time Series (1min)'][x]['4. close']));
     // console.log(res[0]);
     // console.log("dd"+res[1]);

      result.push(res);
    }
    console.log(result[result.length-1][0]);
result.reverse();

    this.setState({result:result,title:response['data']['Meta Data']["2. Symbol"],pointStart1:result[result.length-1][0]})
    


  })
  .catch(function (error) {
    console.log(error);
  });

  axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=M7ZA0AR7JAG5PXSG')
  .then((response) =>{
    //console.log(response['data']['Time Series (1min)']);

    var result=[];
    for (let x in response['data']['Monthly Time Series']) {
      var res=[];
      //console.log(response['data']['Time Series (1min)'][x]['4. close'])
      //console.log(x);
      
      res.push(x);
      res.push(parseFloat(response['data']['Monthly Time Series'][x]['4. close']));
    //  console.log(res[0]);
    //  console.log("dd"+res[1]);

      result.push(res);
    }
      result.reverse();
    this.setState({result2:result,title:response['data']['Meta Data']["2. Symbol"],pointStart2:result[result.length-1][0]})
    


  })
  .catch(function (error) {
    console.log(error);
  });


  axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=M7ZA0AR7JAG5PXSG')
  .then((response) =>{
    //console.log(response['data']['Time Series (1min)']);

    var result=[];
    for (let x in response['data']['Time Series (Daily)']) {
      var res=[];
      //console.log(response['data']['Time Series (1min)'][x]['4. close'])
      //console.log(x);
      
      res.push(x);
      res.push(parseFloat(response['data']['Time Series (Daily)'][x]['4. close']));
      //console.log(res[0]);
     // console.log("dd"+res[1]);

      result.push(res);
    }
result.reverse()
    this.setState({result3:result,title:response['data']['Meta Data']["2. Symbol"],pointStart3:result[result.length-1][0]})
    


  })
  .catch(function (error) {
    console.log(error);
  });
  


    }


    chartUpdate(whichType) {

      if(whichType=="1D")
      {

        
        this.state.pointInterval=60000
        this.state.minRange=50000;
        this.state.data=this.state.result;
       

        
        

      }

      if(whichType=="1Y")
      {

        
        this.state.pointInterval=3600000;
        this.state.minRange=3600000;
        this.state.data=this.state.result2
       
        console.log("date"+Date.UTC(this.pointStart2));
        

      }

      if(whichType=="1M")
      {

        
        this.state.pointInterval=3600000;
        this.state.minRange=3600000;
        this.state.data=this.state.result3
       

      }
      console.log("chartUpdate");
      console.log(this.state.result);
      var chart = {
        zoomType: 'x'
     }; 
      var document = "document";
      var title = {
         text: this.state.title  
      };
      var subtitle = {
         text: document.ontouchstart === undefined ?
         'Click and drag in the plot area to zoom in' :
         'Pinch the chart to zoom in'
      };
      var xAxis = {
         type: 'datetime',
         minRange:  this.state.minRange,
         labels: {
          enabled: false
        }
      };
      var yAxis = {
         title: {
            text: 'Close Price'
         }
      };
      var legend = {
         enabled: false 
      };
      var plotOptions = {
         area: {
            fillColor: {
               linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
               
            },
            stops: [
              [0,"#89BCEE"],
              [1,"#89BCEE"]
           ],
            marker: {
               radius: 2
            },
            lineWidth: 1,
            states: {
               hover: {
                  lineWidth: 1
               }
            },
            threshold: null
         }
      };
      var series = [{
         type: 'area',
         name: 'Price',
         pointInterval: this.state.pointInterval,
       
         data: this.state.data
        
         
      }];
    
    

      var json = {};
      json.chart = chart;
      json.title = title;
      json.subtitle = subtitle;
      json.legend = legend;
      json.xAxis= xAxis;
      json.yAxis = yAxis;  
      json.series = series;
      json.plotOptions = plotOptions;
      
      
        this.setState({
            chartOptions: json
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <HighchartsReactNative
                    styles={styles.container}
                    options={this.state.chartOptions}
                />
                <View style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
               
               <View style={{margin:10}}>
                <Button  title="1Y" onPress={()=>{this.chartUpdate("1Y")}}>
                
                </Button>
                </View>
                <View style={{margin:10}}>
                <Button title="1D" onPress={()=>{this.chartUpdate("1D")}}>

                </Button>
                </View>
                <View style={{margin:10}}>
                <Button title="1M" onPress={()=>{this.chartUpdate("1M")}}>

                </Button>
                </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    
    
    
    backgroundColor: '#fff',
    justifyContent: 'center',
    flex: .8
}
});