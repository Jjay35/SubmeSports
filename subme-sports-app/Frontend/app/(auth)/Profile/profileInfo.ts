//Used to define structure of various data tied to profile

// User Profile Object 
export interface User{
    id : string| null;
    name : string | null;
    hideAge : boolean;
    age : Number | 0 ;
    sportPref : Array<number>; //change to arrays of 1 or 0 for eight elements 
    education: string | "-";
    work:  string | "-";
    interests : string | "-";
    pillars: Array<number>;
    quote : string;
    gameDist : Number;
  }

  //Sports Options
  export let sportsOptions = ["Any", "Basketball", "Bowling", "Dodgeball", "Flag Football", "Golf", "Kickball", "Volleyball", "Soccer"];
