class Simulation {

    countBad = 0;
    countGood = 0;
    running = 0;
    idle = 0;
    slowRunning = 0;
    microStopped = 0;
    lineSpeed = 0;
    lineSpeedMin = 53;
    lineSpeedMax = 200;

    constructor() {
        this.subscribeTopics()
    }

    writeTags() {
        const tags = [{
            topic: "simulation/countGood",
            value: this.countGood
        }, {
            topic: "simulation/countBad",
            value: this.countBad
        }, {
            topic: "simulation/countTotal",
            value: this.countGood + this.countBad
        }, {
            topic: "simulation/running",
            value: this.running
        }, {
            topic: "simulation/idle",
            value: this.idle
        }, {
            topic: "simulation/slowRunning",
            value: this.slowRunning
        }, {
            topic: "simulation/microStopped",
            value: this.microStopped
        }, {
            topic: "simulation/lineSpeed",
            value: this.lineSpeed
        }, {
            topic: "simulation/lineSpeedMin",
            value: this.lineSpeedMin
        }, {
            topic: "simulation/lineSpeedMax",
            value: this.lineSpeedMax
        }]
        RtWs.RtSetValues(tags)
    }

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    productionCount() {
        if (this.running) {
            const isGood = this.getRandom(0, 1) > 0.2
            if (isGood) {
                this.countGood++;
            } else {
                this.countBad++;
            }
        }

        const nextCountTime = this.slowRunning || this.idle ? this.getRandom(70, 120) : this.getRandom(50, 70);

        setTimeout(() => {
            this.productionCount()
        }, nextCountTime * 1000);
    }

    updateLineStatus() {
        if (this.running) {
            this.slowRunning = this.lineSpeed < this.lineSpeedMin ? 1 : 0
            this.idle = 0
        } else {
            this.idle = 1
        }
    }

    toMaxSpeed = false

    updateLineSpeed() {
        this.lineSpeed = RtWs.Value['simulation/lineSpeed'].value || this.lineSpeed
        this.running = RtWs.Value['simulation/running'].value  
        if (this.running) { 
            if (this.lineSpeed < this.lineSpeedMin / 2) {
                this.lineSpeed += this.getRandom(0, this.lineSpeedMin / 5)
                this.toMaxSpeed = true
            } else if (this.lineSpeed > this.lineSpeedMax) {
                this.lineSpeed += this.getRandom(-this.lineSpeedMin / 20, 0)
                this.toMaxSpeed = false
            } else {
                this.lineSpeed += this.getRandom(this.toMaxSpeed ? -this.lineSpeedMin / 20 : -this.lineSpeedMin / 5, this.lineSpeedMin / 10) 
            }
        } else { 
            if (this.lineSpeed > this.lineSpeedMin) {
                this.lineSpeed -= this.getRandom(0, this.lineSpeedMin / 5)
            } else if (this.lineSpeed > this.lineSpeedMin / 10) {
                this.lineSpeed -= this.getRandom(0, this.lineSpeedMin / 10)
            } else {
                this.lineSpeed = 0
            }
        }
        this.updateLineStatus()
        this.writeTags()
    }

    subscribeTopics() {
        const tags = ["simulation/countGood", "simulation/countBad", "simulation/running", "simulation/idle",
            "simulation/slowRunning", "simulation/microStopped", "simulation/lineSpeed", "simulation/lineSpeedMin",
            "simulation/lineSpeedMax"
        ]

        RtWs.RtAddSubscribe(tags)
    }

    start() {
        this.countGood = RtWs.Value['simulation/countGood'].value
        this.countBad = RtWs.Value['simulation/countBad'].value
        this.lineSpeed = RtWs.Value['simulation/lineSpeed'].value
        this.running = RtWs.Value['simulation/running'].value || this.getRandom(0, 50) > 1 ? 1 : 0

        console.log("START SIMULATION")
        // velocidad 
        setInterval(() => {
            this.updateLineSpeed()
        }, 500);

        // contar piezas
        setTimeout(() => {
            this.productionCount()
        }, 60 * 1000);

        // marcha / parada
        setInterval(() => {
            this.running = this.getRandom(0, 5) > 1 ? 1 : 0
        }, 2 * 60 * 1000);
    }
}


const simulation = new Simulation()
setTimeout(() => {
    simulation.start()
}, 500);