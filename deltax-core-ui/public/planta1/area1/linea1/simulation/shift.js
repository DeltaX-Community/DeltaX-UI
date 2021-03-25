 class Shift {
     config = {
         shifts: [{
             name: "Mañana",
             start: "06:00:00",
             end: "12:00:00",
         }],
         crews: [{
             name: "Dia de la memoria por la verdad y la justicia",
             isHoliday: true,
             start: "2021-03-24T00:00:00-03:00",
             end: "2030-03-25T00:00:00-03:00",
         }],
         crewProfile: {
             "profile1": {
                 name: "5x2",
                 hoursByShift: 6,
                 workDays: 5,
                 freeDays: 2,
             }
         }
     }

     constructor(config = {}) {
         this.config = config
     }

     dateToLocalISOString(date) {
         const offset = date.getTimezoneOffset()
         return new Date(date.getTime() - (offset * 60 * 1000)).toISOString()
     }

     getshift(now = new Date()) {

         const idx = config.shifts.findIndex(s => {
             const start = new Date(`${this.dateToLocalISOString(now).split('T')[0]}T${s.start}`)
             const end = new Date(`${this.dateToLocalISOString(now).split('T')[0]}T${s.end}`)

             // console.log(start, end)
             return start <= now && end > now
         })

         return idx >= 0 ? config.shifts[idx] : null;
     }

     getCrew(now = new Date()) {
         let crews = config.crews.filter(c => {
             const start = new Date(c.start)
             if (start <= now) {
                 return c.end ? new Date(c.end) >= now : true
             }
             return false;
         })

         crews = crews.sort((a, b) => {
             return new Date(b.start) - new Date(a.start);
         })

         const idx = crews.findIndex(c => {
             const profile = c.isHoliday ? {
                     hoursByShift: 24,
                     workDays: 1,
                     freeDays: 0,
                 } :
                 config.crewProfile[c.profile]
             const start = new Date(c.start)
             const totalDays = profile.workDays + profile.freeDays
             const diffDays = (now - start) / 1000 / 60 / 60 / 24;
             const dayWork = diffDays % totalDays;
             const startShiftToday = new Date(now - ((dayWork % 1) * 24 * 60 * 60 * 1000));
             const endShiftToday = new Date(startShiftToday.getTime() + profile.hoursByShift * 60 * 60 * 1000)

             // Is Free Day
             if (dayWork > profile.workDays) {
                 return false;
             }

             // console.log("Valid Day", start, "Shift today", c.name, startShiftToday, endShiftToday, dayWork) 
             return startShiftToday <= now && endShiftToday > now
         })

         return idx >= 0 ? crews[idx] : null;
     }
 }


 async function test() {
     var config = await fetch("./shiftCrew.json").then(j => j.json())
     const shift = new Shift(config)


     const validators = [{
             date: '2021-03-21T12:00:00-03:00',
             shift: true,
             crew: false
         },
         {
             date: '2021-03-22T06:00:00-03:00',
             shift: true,
             crew: true
         },
         {
             date: '2021-03-22T11:59:59-03:00',
             shift: true,
             crew: true
         },
         {
             date: '2021-03-22T12:00:00-03:00',
             shift: true,
             crew: true
         },
         {
             date: '2021-03-22T18:00:00-03:00',
             shift: true,
             crew: true
         },
         {
             date: '2021-03-22T23:59:58-03:00',
             shift: true,
             crew: true
         },
         {
             date: '2021-03-23T00:00:00-03:00',
             shift: false,
             crew: false
         },
         {
             date: '2021-03-23T00:00:01-03:00',
             shift: false,
             crew: false
         },
         {
             date: '2021-03-23T05:59:59-03:00',
             shift: false,
             crew: false
         },
         {
             date: '2021-03-23T06:00:00-03:00',
             shift: true,
             crew: true
         },
         {
             date: '2021-03-24T08:59:59-03:00',
             shift: true,
             crew: true
         },
     ]

     validators.forEach(d => {
         var now = new Date(d.date)
         console.log("---- Validando Fecha:", now.toLocaleString())

         const s = shift.getshift(now)
         console.log("Turno:", s)
         const c = shift.getCrew(now)
         console.log("Escuadra:", c)

         if (!(d.shift == !!s) || !(d.crew == !!c)) {
             console.log("****** :: TEST FAIL! ******** ")
         }
     })
}
 
test()