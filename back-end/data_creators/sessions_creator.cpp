#include<fstream>
#include<iostream>
#include <stdlib.h>
#include <iomanip>
#define cout fout

using namespace std;

ifstream finpoints("points.in");
ifstream findrivenby("drivenby.in");
ofstream fout("sessions.csv");

struct point{
    int point_id;
    int station_id;
    float cost_p_kwh;
};

struct drivenby{
    int ownerid;
    string license_plate;
    float battery_size;
};

point points[100];
drivenby drives[100];
int pointsN=0,drivesN=0,N=200;
string protocols[2]={"normal(20kW)","fast(50kW)"};


void printTimes(float charging_time){
    int charging_hours=int(charging_time);
    int charging_minutes=60*(charging_time - charging_hours);
    int c_month=1+rand()%12;
    int c_day=1+rand()%30;
    int c_hour=rand()%24;
    int c_mins=rand()%60;
    int c_secs=rand()%60;
    int c_year=2020;

    if(c_month==2 && c_day>28)
        c_day=28;

    cout<<c_year<<"-";
    (c_month<=9)?cout<<"0"<<c_month<<"-":cout<<c_month<<"-";
    (c_day<=9)?cout<<"0"<<c_day<<" ":cout<<c_day<<" ";
    (c_hour<=9)?cout<<"0"<<c_hour<<":":cout<<c_hour<<":";
    (c_mins<=9)?cout<<"0"<<c_mins<<":":cout<<c_mins<<":";
    (c_secs<=9)?cout<<"0"<<c_secs:cout<<c_secs;
    cout<<",";

    c_mins+=charging_minutes;
    if(c_mins>=60){
        c_hour++;
        c_mins=c_mins%60;
    }
    c_hour+=charging_hours;
    if(c_hour>=24){
        c_day++;
        c_hour=c_hour%24;
    }
    if((c_day>=32 && (c_month==1 || c_month==3 || c_month==5 || c_month==7 ||c_month==8 || c_month==10 ||c_month==12))
        ||(c_day>=31 && (c_month==4 || c_month==6 || c_month==9 || c_month==11))
        ||(c_day>=30 && c_month==2)){
            c_month++;
            c_day=1;
       }
    if(c_month>=13){
        c_year++;
        c_month=1;
    }


    cout<<c_year<<"-";
    (c_month<=9)?cout<<"0"<<c_month<<"-":cout<<c_month<<"-";
    (c_day<=9)?cout<<"0"<<c_day<<" ":cout<<c_day<<" ";
    (c_hour<=9)?cout<<"0"<<c_hour<<":":cout<<c_hour<<":";
    (c_mins<=9)?cout<<"0"<<c_mins<<":":cout<<c_mins<<":";
    (c_secs<=9)?cout<<"0"<<c_secs:cout<<c_secs;
    cout<<",";
}


int main(){

while(!finpoints.eof()){
    finpoints>>points[pointsN].point_id>>points[pointsN].station_id>>points[pointsN].cost_p_kwh;
    pointsN++;
}
pointsN--;
while(!findrivenby.eof()){
    findrivenby>>drives[drivesN].ownerid>>drives[drivesN].license_plate>>drives[drivesN].battery_size;
    drivesN++;
}
drivesN--;

cout<<"\"driven_byowner_id\",\"driven_byregistered_carslicense_plate\",\"charging_pointspoint_id\",\"charging_pointscharging_stationsstation_id\",\"connectionTime\",\"disconnectTime\",\"kWhDelivered\",\"protocol\",\"payment\",\"cost\",\"rating\"";
for(int i=0;i<N;i++){
    point tempPoint = points[rand()%pointsN];
    drivenby tempDrive = drives[rand()%drivesN];
    int protocol= rand()%2;
    float kwh_delivered = tempDrive.battery_size*(float(5+(rand()%6))/10);
    float cost=(kwh_delivered*tempPoint.cost_p_kwh)*(1.0+2*float(protocol)/10);
    float charging_time=(protocol==0) ? (kwh_delivered/20) : (kwh_delivered/50);
    cout<<tempDrive.ownerid<<",\"";
    cout<<tempDrive.license_plate<<"\",";
    cout<<tempPoint.point_id<<",";
    cout<<tempPoint.station_id<<",";
    printTimes(charging_time);
    cout<<kwh_delivered<<",";
    cout<<"\""<<protocols[protocol]<<"\",";
    cout<<"\"card\",";
    cout << fixed<<setprecision(2)<<cost<<",";
    if(rand()%10>=4) cout<<(5-(rand()%6+rand()%2)%5); else cout<<"NULL";
    cout<<endl;

}

}
