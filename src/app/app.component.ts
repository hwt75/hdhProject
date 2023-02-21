import { Component, OnInit } from '@angular/core';
import { FirstComeFirstServe, PreemptivePriority, Priority, RoundRobin, ShortestJobFirst, STRF } from './classes/algorithm';
import { Job } from './classes/job';
import { Simulation } from './classes/simulation';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'CPU-Scheduling';
  simulation: any = null;
  jobs: Job [] = [];
  jobsDemo: Job [] = [];


  simSpeed = 1000;
  quantum = 2;
  jobCount = 8;
  algo = "fcfs";
  constructor(){
    this.newSim();
  }

  ngOnInit(){
  }

  generateNumbers(){
    for (var i = 1; i<= this.jobCount;i++){
      const jobs: Job = Job.createJob(0,0,0,0);
      this.jobsDemo.push(jobs)
    }
  }

  speedChanged(){
    this.setTimer(Number(this.simSpeed));
  }
  handleChanged(){
    this.resetJobDemo();
    this.generateNumbers();
    this.newSim(this.jobs.length === this.jobCount);
  }

  interval:any = null;
  setTimer(time: number){
    if(this.interval){ clearInterval(this.interval); }
    if(time === 0){ return; }
    this.interval = setInterval(()=>{
      if(this.simulation.isFinished()){ clearInterval(this.interval); this.running = false; }
      this.simulation.nextStep();
    }, time);
  }

  getAlgorithm(){
    switch(this.algo){
      case "fcfs": { return new FirstComeFirstServe(); }
      case "sjf": { return new ShortestJobFirst(); }
      case "rr": { return new RoundRobin(); }
      case "p": { return new Priority(); }
      case "pp": { return new PreemptivePriority(); }
      case "strf": { return new STRF(); }
    }
    return new FirstComeFirstServe();
  }

  running = false;
  newSim(sameJobs: boolean = false){
    this.stop();
    if(!sameJobs){
      this.jobs = [];
      for(let i=0; i<Number(this.jobCount); i++){
        this.jobs.push(Job.createRandomJob(i + 1));
      }
    }

    let tmp:any = this.getAlgorithm();
    tmp["quantumTime"] = Number(this.quantum);
    this.simulation = new Simulation(tmp, this.jobs);
    this.simulation.reset();
  }

  saveJobData(jobId:number, arrivalTime:string, burst: string, priority:string){
    const jobs: Job = Job.createJob(jobId,parseFloat(arrivalTime), parseFloat(burst), parseFloat(priority));
    this.jobsDemo.push(jobs);
  }
  saveJob(){
      this.jobsDemo.forEach((item,index)=>{
        item.id = index+1
      })
      this.jobs=this.jobsDemo
     let tmp:any = this.getAlgorithm();
    tmp["quantumTime"] = Number(this.quantum);
    this.simulation = new Simulation(tmp, this.jobs);
    this.simulation.reset();
    this.closeModal();
  }
  clearData(){
    this.jobsDemo = []
  }
  play(){
    if(this.simulation.isFinished()){
      this.simulation.reset();
    }
    this.running = true;
    this.setTimer(this.simSpeed);
  }
  stop(){
    this.running = false;
    this.setTimer(0);
  }
  next(){
    this.stop();
    this.simulation.nextStep();
  }
  finish(){
    this.setTimer(1);
  }
  reset(){
    this.stop();
    this.simulation.reset();
  }
  resetJobDemo(){
    this.jobsDemo = [];
  }
  openModal() {
    $('#exampleModal').modal('show');
  }
  closeModal() {
    $('#exampleModal').modal('hide')
  }

}
