/* Magic Mirror
 * Module: tpg
 *
 * By Alexandre LUINI http://github.com/aluini
 * MIT Licensed.
 */
Module.register('tpg', {
  // Module config defaults.
  defaults: {
    updateInterval: 300000, // 5min
    maxDepartures: 10, // max 10 entries
    api: {
      base: 'http://prod.ivtr-od.tpg.ch/v1/',
      method: 'GetNextDepartures'
    },
    params: {
      stopCode: '',
      key: ''
    }
  },
  // get jQuery
  getScripts: function () {
    return [this.file('js/jquery.js')]
  },
  // get styles
  getStyles: function () {
    return ['font-awesome.css', this.file('css/tpg.css')]
  },
  // init method
  start: function () {
    Log.info('Starting module: ' + this.name)
    this.result = false
    this.url = this.config.api.base + this.config.api.method + '?' + $.param(this.config.params)
    this.getData()
    setInterval(() => {
        this.getData();
    }, this.config.updateInterval)
  },
  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement('div')
    if (this.result) {
      var table = document.createElement('table')
      table.classList.add('small', 'table', 'align-left')

      var departures = this.result.departures
      var maxDeparture = this.config.maxDepartures
      departures.forEach(function (departure, i) {
        if (i < maxDeparture) {
          var departure_row = document.createElement('tr')

          var departure_vehiculType = document.createElement('td')
          var vehiculType = document.createElement('i')
          vehiculType.classList.add('fa', departure.vehiculeType === 'AB' || departure.vehiculeType === 'ABA' ? 'fa-bus' : 'fa-subway')
          departure_vehiculType.appendChild(vehiculType)
          departure_row.appendChild(departure_vehiculType)

          var departure_name = document.createElement('td')
          departure_name.innerHTML = departure.line.lineCode + ' ' + departure.line.destinationName
          departure_row.appendChild(departure_name)

          var departure_time = document.createElement('td')
          departure_time.classList.add('centered')
          departure_time.innerHTML = departure.waitingTime
          departure_row.appendChild(departure_time)

          if (departure.waitingTime !== 'no more') {
            table.appendChild(departure_row)
          }
        }
      })
      wrapper.appendChild(table)
    } else {
      wrapper.innerHTML = 'Loading...'
    }
    return wrapper
  },

  getData: function () {
    $.getJSON(this.url, (data) => {
      this.result = data
      this.updateDom()
    })
  }
})
