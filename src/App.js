import React, { Component } from 'react';
import {Grid, Button, withStyles, Modal, Table, TableHead, TableRow, TableBody, TableCell} from '@material-ui/core'
import {Details} from '@material-ui/icons'
import GridLayout from "react-grid-layout";
// import imgGear from './static/gear.png'
// import imgPlane from './static/plane.png'
// import imgChip from './static/chip.png'
// import imgBattery from './static/battery.png'
// import imgAiBrain from './static/ai-brain.png'
// import gridBack from './static/gridBack.jpg'
// import sky from './static/sky.jpg'
// import HelpText from './components/HelpText'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

const google = window.google;
// const SCORES_COLUMNS = [
//     {field: 'timeSpent', headerName: 'Time Spent'},
//     {field: 'moves', headerName: 'Moves'},
//     {field: 'win', headerName: 'Won ?'},
// ]
const layout = [
  {i: "0", x: 0, y: 0, w: 1, h: 2, img: "https://cdn-icons-png.flaticon.com/512/1766/1766429.png"},
  {i: "1", x: 1, y: 0, w: 2, h: 2, img: "https://cdn-icons.flaticon.com/png/512/6221/premium/6221857.png?token=exp=1659625743~hmac=3f1970f7bcf82e2ed577dfb6ce3731fc"},
  {i: "2", x: 3, y: 0, w: 1, h: 2, img: "https://cdn-icons-png.flaticon.com/512/1766/1766429.png"},
  {i: "3", x: 0, y: 2, w: 1, h: 2, img: "https://cdn-icons-png.flaticon.com/512/978/978022.png"},
  {i: "4", x: 1, y: 2, w: 2, h: 1, img: "https://cdn-icons-png.flaticon.com/512/484/484664.png"},
  {i: "5", x: 1, y: 3, w: 1, h: 1, img: "https://cdn-icons-png.flaticon.com/512/2432/2432572.png"},
  {i: "6", x: 2, y: 3, w: 1, h: 1, img: "https://cdn-icons-png.flaticon.com/512/2432/2432572.png"},
  {i: "7", x: 3, y: 2, w: 1, h: 2, img: "https://cdn-icons-png.flaticon.com/512/978/978022.png"},
  {i: "8", x: 0, y: 4, w: 1, h: 1, img: "https://cdn-icons-png.flaticon.com/512/2432/2432572.png"},
  {i: "9", x: 4, y: 4, w: 1, h: 1, img: "https://cdn-icons-png.flaticon.com/512/2432/2432572.png"},
]

const originalLayout = getFromLS("layout") || Object.assign([],layout);
const originalMoves = getFromLS("moves") || 0;
const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#f1e200",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },

  frame : {
    border : "1px solid black",
    width: '300px',
    height: '380px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: "rgba(249, 249, 97, 0.5)",
    overflow: "hidden",
  },

  help: {
    "&:hover" : {
      cursor: 'pointer',
      filter: "brightness(120%)"
    },
    color: "black",
    margin: "5px 0 0 0",
    fontSize: "2em",
  },

  grid : {
    '&:hover': {
      cursor: 'pointer',
      filter: "brightness(120%)"
    },
    fontFamily: 'wt034',
    boxShadow: "2px 2px 3px black",
    borderRadius: "2px",
    boxSizing: "border-box",
    backgroundColor: "#45FFFF",
    fontSize: "3em",
    color: "#202020",
    textShadow: "1px 1px 1px #ccc",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  sBlock: {
    fontSize: "1.5em",
    color: "#3d2b20",
    textShadow: "1px 1px 1px white",
  },

  wBlock: {
    textShadow: "1px 1px 1px blue",
  },

  vBlock: {
    textShadow: "1px 1px 1px yellow",
  },

  bBlock: {
    fontSize: "5em",
    color: '#e04c23',
    textShadow: "2px 2px 1px black"
  },

  button : {
    '&:hover': {
      cursor: 'pointer',
    },
    marginTop: "10px",
    fontSize: "12px",
  },

  nonfreedom: {
    margin: "0",
    color: "green",
    opacity: "0.8",
    textShadow: "1px 1px 1px black"
  },

  freedom: {
    margin: "0",
    color: "green",
    filter: "brightness(150%)",
    textShadow: "1px 1px 1px black"
  },

  modalScreen: {
    minHeight: "100vh",
    backgroundColor: "rgba(255,255,255,0.7)",
  },

  modalContent : {
    width: "430px",
    height: "300px",
    textAlign: "center",
  }
}


function getFromLS (key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("klotski")) || {};
    } catch (e) {
    }
  }
  return ls[key];
}

function saveToLS (key, value) {
  if (global.localStorage) {
    let ls = JSON.parse(global.localStorage.getItem('klotski')) || {};
    ls[key] = value;
    // global.localStorage.setItem("klotski", JSON.stringify({[key]: value}))
    global.localStorage.setItem("klotski", JSON.stringify(ls))
    if(!global.localStorage.getItem("klotski_start_time")) {
        global.localStorage.setItem("klotski_start_time", Date.now())
    }
  }
}

function saveToServer(startTime, moves, win) {
    let playTime = null
    if(startTime){
        playTime = Date.now() - startTime
    }
    playTime /= 1000 // To get in seconds

    const dataToSave = [String(new Date()), playTime, moves, win]
    console.log('Data to save', dataToSave)
    if(google){
        google.script.run.addNewRow(dataToSave)
    } else {
        console.warn('Unable to save, need to be on server')
    }
}

class App extends Component {
  targetElement = null;

  constructor(props) {
    super(props)
    this.state = {
      layout: JSON.parse(JSON.stringify(originalLayout)),
      prevLayout: [],
      dragged: null,
      win: false,
      helpOpen: false,
      moves: parseInt(originalMoves),
      scores: []
    }

    this.loadScores()
  }

  componentDidMount() {
    this.targetElement = document.querySelector('#mainPanel');
    // disableBodyScroll(this.targetElement);
  }

  componentWillUnmount() {
    clearAllBodyScrollLocks();
  }
  onLayoutChange = layout => {
    const dragged = this.state.dragged
    if (dragged) {
      const currentLayout = layout.slice(0,10)
      const newItem = currentLayout[dragged]
      const oldItem = this.state.prevLayout[dragged]
      if (newItem.x !== oldItem.x || newItem.y !== oldItem.y) {
          if (Math.abs(newItem.x - oldItem.x) >1 || Math.abs(newItem.y - oldItem.y) > 1 || (Math.abs(newItem.x - oldItem.x) >=1 && Math.abs(newItem.y - oldItem.y) >= 1)) {
            global.location.reload()
          } else {
            let win = false
            if (newItem.i === "1" && newItem.x === 1 && newItem.y ===3) {
              win = true
            }
            let moves = parseInt(this.state.moves) + 1
            this.setState({layout: currentLayout, win: win, moves: moves})
            saveToLS("layout", currentLayout)
            saveToLS("moves", moves)
          }
    }
  }
  }

  onDragStart = (layout, oldItem, newItem, placeholder, e, element) => {
    this.setState({
      prevLayout : Object.assign([], layout.slice(0,10))
    })
  }

  onDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
    this.setState({
      dragged: parseInt(newItem.i)
    })
  }

  reset = e => {
    this.setState({
      layout: Object.assign([],layout),
      win: false
    })
    global.localStorage.clear()
  }

  save = e => {
    const startTime = global.localStorage.getItem("klotski_start_time");
    saveToServer(startTime, this.state.moves, this.state.win)
    this.loadScores()
  }

  loadScoresSuccessHandler = (scores) => {
    if(!scores){
        scores = []
    }
    scores = scores.reverse()
    scores = scores.map((row) => { 
        return {
            timestamp: row[0],
            timeSpent: Math.round(row[1]/60), 
            moves: row[2],
            win: row[3] ? "Yes !" : "Not yet"} 
        });
    scores = scores.filter( (obj) => {
        return obj.timestamp ? true : false
    })
    console.debug('Scores: ', scores)
    this.setState({scores: scores})
  }

  loadScores = () => {
    if(google){
        google.script.run.withSuccessHandler(this.loadScoresSuccessHandler).getLatestRows(10)
    } else {
        console.warn('Unable to load scores locally need to run on server')
    }
  }

  render() {
    const {classes} = this.props
    return (
    <div>
        <Grid container direction="column" justify="flex-start" alignItems="center" className={classes.wrapper} id="mainPanel">
            <h1 style={{margin: "15px 0 0 0", textShadow: "1px 1px 1px white"}}>CyberKlotski 2077</h1>
            <Grid container justify="flex-start" className={classes.frame}>
                <GridLayout layout={this.state.layout} cols={4} rowHeight={70} width={280} margin={[2,2]} containerPadding = {[0,0]} isResizable={false} preventCollision={true} compactType={null} onLayoutChange={this.onLayoutChange} onDragStart={this.onDragStart} onDragStop={this.onDragStop} draggableHandle=".moving-grid">
                    {layout.map((block, i) => {
                    const classTag = ([0,2,3,7].includes(i) ? classes.vBlock : ([5,6,8,9].includes(i) ? classes.sBlock : (i === 4 ? classes.wBlock : classes.bBlock)))
                    return (
                        <div className={this.state.win ? [classes.grid, classTag] : [classes.grid, "moving-grid", classTag]} key={block.i}>
                            <img alt="block that you can move" className="block-img" src={block.img} style={{height: 50, width: 50}}/>
                        </div>
                )}
                    )}
                    <div key="z" data-grid={{x: 0, y: 5, w: 4, h: 3, static: true}}></div>
                </GridLayout>
            </Grid>
            <Grid container justify="center" direction="column" alignItems="center">
                <Details style={{marginTop: "5px"}}/>
                <h3 className={this.state.win ? classes.freedom : classes.nonfreedom}><i>EXIT</i></h3>
                <Button variant="contained" className={classes.button} onClick={this.reset}>
                    Reset
                </Button>
                <Button variant="contained" className={classes.button} onClick={this.save}>Save</Button>
                <Button variant="contained" className={classes.button} onClick={this.loadScores}>Load scores</Button>
            </Grid>
            
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Time playing (minutes)</TableCell>
                        <TableCell align="right">Moves</TableCell>
                        <TableCell align="right">Win ?</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {this.state.scores.map((row) => (
                    <TableRow key={row.timestamp} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                            {row.timestamp}
                        </TableCell>
                        <TableCell align="right">{row.timeSpent}</TableCell>
                        <TableCell align="right">{row.moves}</TableCell>
                        <TableCell align="right">{row.win}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            
            <Modal open={this.state.win}>
                <Grid container direction="column" justify="center" alignItems="center" className={classes.modalScreen}>
                    <Grid container direction="column" justify="center" alignItems="center" className={classes.modalContent}>
                        <div>
                            <h3>You helped the Plane get freedom!</h3>
                            <h3>You are the hero!</h3>
                        </div>
                        <Button style={{marginTop:"50px"}} variant="contained" color="primary" onClick={this.reset}>
                            Replay
                        </Button>
                    </Grid>
                </Grid>
            </Modal>
        </Grid>
    </div>
    );
  }
}

App = withStyles(styles)(App)
export default App;
