import { Component, OnInit } from '@angular/core';
import { FirstComeFirstServe, RoundRobin, ShortestJobFirst, STRF } from './classes/algorithm';
import { Job } from './classes/job';
import { Simulation } from './classes/simulation';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// class appComponent dùng để điều khiển giao diện thông qua thư viện Angular
export class AppComponent implements OnInit{
  // tạo giá trị ban đầu cho chương trình
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
// điều chỉnh tốc độ
  speedChanged(){
    this.setTimer(Number(this.simSpeed));
  }
  // xử lý hành động
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
// xử lý thuật toán
  getAlgorithm(){
    switch(this.algo){
      case "fcfs": { return new FirstComeFirstServe(); }
      case "sjf": { return new ShortestJobFirst(); }
      case "rr": { return new RoundRobin(); }
      case "strf": { return new STRF(); }
    }
    return new FirstComeFirstServe();
  }

  running = false;
  // Tạo ngẫu nhiên data mới
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
// Lưu công việc nhập từ form
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
  // reset
  clearData(){
    this.jobsDemo = []
  }
  // chạy chương trình
  play(){
    if(this.simulation.isFinished()){
      this.simulation.reset();
    }
    this.running = true;
    this.setTimer(this.simSpeed);
  }
  // tạm dùng chương trình
  stop(){
    this.running = false;
    this.setTimer(0);
  }
  // chuyển sang công việc tiếp theo
  next(){
    this.stop();
    this.simulation.nextStep();
  }
  // Tua nhanh thời gian mô phỏng
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
  // bật form nhập dữ liệu
  openModal() {
    $('#exampleModal').modal('show');
  }
  // đóng form nhập dữ liệu
  closeModal() {
    $('#exampleModal').modal('hide')
  }

}
