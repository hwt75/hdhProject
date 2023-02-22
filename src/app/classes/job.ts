

// Class Job dùng để kiểm soát các công việc đang chạy
export class Job {
    id: number = 0; // id công việc
    arrivalTime: number = 0; // thười gian đến
    burst: number = 0; // burst
    priority: number = 0; // mức độ ưu tiên

    startTime: number = 0; // thời gian bắt đầu
    finishTime: number = 0; // thời gian kết thúc
    remaining: number = 0; // thời gian đợi


    // tự động tạo ra dữ liệu công việc
    static createRandomJob(jobId: number) {

        let random = (max: number, min: number =1) => { return Math.floor(Math.random() * max) + min; }
        let arriveTime = jobId === 1 ? 1 : random(30, 2);
        let burst = random(12);
        let priority = random(125);
        return new Job(jobId, arriveTime, burst, priority);
    }
    // tạo công việc từ dữ liệu nhập vào
    static createJob(jobId: number,arriveTime:number,burst:number, priority: number){
      let arriveTimeCheck = jobId === 1 ? 1 : arriveTime;
      return new Job(jobId, arriveTimeCheck, burst, priority);
    }
    constructor(jobId: number, arriveTime: number, burst: number, priority: number) {
        this.id = jobId;
        this.arrivalTime = arriveTime;
        this.burst = burst;
        this.priority = priority;
        this.remaining = this.burst;
    }
// bắt dầu chạy
    get started(){
        return this.burst !== this.remaining;
    }
    // kết thúc
    get finished(){
        return this.remaining === 0;
    }

    // lấy phần trăm tiến độ công việc
    get percent(){
        return Math.floor(((this.burst - this.remaining) * 100) / this.burst);
    }
    reset(){
        this.startTime = 0;
        this.finishTime = 0;
        this.remaining = this.burst;
    }
    // hàm xử lý công việc
    process(simulationTime: number){
        if(this.finished){ throw new Error("Can't work on finished job"); }
        if(!this.started){ this.startTime = simulationTime; }
        this.remaining--;
        if(this.finished){ this.finishTime = simulationTime + 1; }
    }
    // thời gian quay lại
    getTurnaroundTime(simulationTime: number){
        if(!this.started){ return 0; }
        if(this.finished){ return this.finishTime - this.arrivalTime; }
        return simulationTime + 1 - this.arrivalTime;
    }
    // lấy thời gian đợi
    getWaitingTime(simulationTime: number) {
        return this.getTurnaroundTime(simulationTime) - (this.burst - this.remaining);
    }

    // các hàm compare bên dưới dùng để xử lý logic khi chạy chương trình 
    compareById(other: Job) {
        return this.id - other.id;
    }
    compareByArrive(other: Job) {
        let tmp = this.arrivalTime - other.arrivalTime;
        return tmp === 0 ? this.compareById(other) : tmp;
    }
    compareByBurst(other: Job) {
        let tmp = this.burst - other.burst;
        return tmp === 0 ? this.compareByArrive(other) : tmp;
    }
    compareByPriority(other: Job) {
        let tmp = this.priority - other.priority;
        return tmp === 0 ? this.compareByArrive(other) : tmp;
    }
    compareByRemaining(other: Job) {
        let tmp = this.remaining - other.remaining;
        return tmp === 0 ? this.compareByArrive(other) : tmp;
    }
}
