import React, {useState, useEffect} from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.css';
import App from './App';

function Window(){
  return(
  <Game/>
  )
} 
function Game(){
  const [size, setSize] = useState(9);
  const [gameMode, setGameMode] = useState(0);
  const [map, setMap] = useState(Array(size).fill().map(function(){ return new Array(size).fill('free');}));
  const [mode, setMode] = useState(0);//1 play
  const [head, setHead] = useState({x:0, y:0});
  const [snake, setSnake] = useState([]);
  const [score, setScore] = useState(0);
  const [appleCount, setAppleCount] = useState(0);
  const [maxApples, setMaxApples] = useState(2);
  const [keyPressed, setKeyPressed] = useState(false);


  async function addApples(){
    let x =-1 ,y = -1;
    do{
    x = Math.floor(Math.random()*size);
    y = Math.floor(Math.random()*size);
    }
    while((x===head.x && y === head.y)|| map[x][y]==='apple'||map[x][y]==='player')
    //console.log(`spawing an apple: ${x} ${y} head: ${head.x} ${head.y}`)
    map[x][y]='apple';
  }
  

  async function move(row, column){
    if(gameMode===1)
      return
    setHead({x:row, y: column})
    //console.log(row+', '+column)
    let type = map[row][column];

    const newMap = map;

    let hit = checkMap(type)
    if(hit==='gg')
      setGameMode(1)
    if(type==='apple'){
      let newSnake = snake;
      newSnake = Array.from(newSnake)
      //console.log(newSnake)
      newSnake.push({x:row, y: column})
      setSnake( newSnake )
      newMap[row][column] = 'player'
    }
    else{
      let newSnake = snake;
      newSnake = Array.from(newSnake)
      let temp = newSnake.shift();
      //console.log(newSnake)
      newSnake.push({x:row, y: column})
      setSnake( newSnake )
      if(temp)
        newMap[temp.x][temp.y] = 'free';
        newMap[row][column] = 'player';
    }
    //console.log(snake)
    setMap(newMap)
    //console.log(newMap)
  }


  function grow(row, column){
    setSnake(snake.push({x:row, y:column}))
  }

  function shrink(){
    return(snake.shift())
  }


  function checkMap(type){
    console.log(`Checking map: ${type}`)
    switch(type){
      case 'apple':
        setScore(score+1);
        addApples()
        break;
      case 'player':
        return 'gg';
        break;
    }
    return Promise.resolve();
  }

  function modulo(a, n){
    return ((a % n ) + n ) % n
  }
  function go(direction){
    if(!mode){
      return
    }
    switch(direction){
      case 'w':
        move(modulo(head.x-1, size), head.y)
        break;
      case 's':
        move(modulo(head.x+1, size), head.y)
        break;
      case 'a':
        move(head.x, modulo(head.y-1, size))
        break;
      case 'd':
        move(head.x, modulo(head.y+1, size))
        break;
    }
  }

  async function spawn(row, column){
    //console.log('spawn')
    if(mode===1){
      //console.log('aaaaAAA!!!')
      return
    }
    await move(row, column).then(setMode(1)).then(addApples()).then(addApples());
    setMode(1);
  }

  function onkeypress(key){
    let newKey = key.toLowerCase();
    alert(key)
    switch(newKey){
      case 'w':
        go('w')
        break;
      case 'a':
        go('a')
        break;
      case 's':
        go('s')
        break;
      case 'd':
        go('d')
        break;
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", (event)=>{onkeypress(event.key)})
    return () => {
        window.removeEventListener("keydown", (event)=>{onkeypress(event.key)})
        window.removeEventListener("keyup", (event)=>{onkeypress(event.key)})
    }
})

  return(
    
  <div>
    <div style={{textAlign:'center'}}>{gameMode? <div ><h1>{'Game Over'}</h1></div> :''}<h2>{score}</h2></div>
    
    <div>
      <Map map={map} size={size} spawn={spawn}/>
    </div>
    <div>
      <Controls onclick={go}/>
      <keyHandle/>
    </div>
  </div>
  );
}



function Controls(props){
  return(
  <div>
    <div>
      <button onClick={()=>props.onclick('w')}>{'🠕'}</button>
    </div>
    <div>
      <button onClick={()=>props.onclick('a')}>{'🠔'}</button>
      <button onClick={()=>props.onclick('s')}>{'🠗'}</button>
      <button onClick={()=>props.onclick('d')}>{'➝'}</button>
    </div>
  </div>
  );
}


function Map(props){
  return(
    props.map.map( (row, index)=> {
      
      return <div>
        <Row row={props.map[index]} size={props.size} rowNum = {index} spawn={props.spawn}/>
      </div>;
  } )
    
  )
}
function Row(props){

  return props.row.map( ( cell, index ) =>{ 
    return <Cell value={props.row[index]} size = {props.size} rowNum = {props.rowNum} columnNum = {index} spawn = {props.spawn}/>;
} );
}


function Cell(props){
  var color;
  switch(props.value){
    case 'free':
      color = 'green'
      break;
    case 'player':
      color = 'white'
      break;
    case 'apple':
      color = 'red'
      break;
    default:
      color = 'green'
      break;
  }
  let buttonSize = 100/props.size
  return(
   <button className="button" style={{background: color, height: buttonSize+'%', width: buttonSize+'%'}} onClick={()=>props.spawn(props.rowNum, props.columnNum)}>{props.rowNum}, {props.columnNum}</button>
  )
}


  ReactDOM.render(
    <Window />,
    document.getElementById('root')
  );
  