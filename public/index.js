async function classify(e,form) {
    e.preventDefault()
    const response = await fetch(`/api/classify?sequence=${form.sequence.value}&candidate_labels=${form.candidate_labels.value}&multi_label=${form.multiple_true_classes.checked}`, {
        method:'GET'
    })
    data = await response.json()
    classification_result = document.querySelector('#classification_result_table')
    classification_result.innerHTML = ''

    const table  = document.createElement('table')
    table.classList.add('table')
    table.classList.add('table-sm')
    table.classList.add('table-striped')
    table.classList.add('table-bordered')
    table.style.fontFamily = 'monospace'

    const tbody = table.createTBody()

    for (let i = 0; i < data.length; i++) {
        const tr = tbody.insertRow(i)
    
        const tdLabel = tr.insertCell()
        tdLabel.appendChild(document.createTextNode(data[i].label))
    
        const tdScore = tr.insertCell()
        tdScore.appendChild(document.createTextNode(data[i].score))
    }
    classification_result.appendChild(table)
}

class DynamicPlaceholder {
  constructor(options) {
    this.options = options
    this.element = options.element
    this.placeholderIdx = 0
    this.charIdx = 0
  }

  setPlaceholder() {
    const placeholder = this.options.placeholders[this.placeholderIdx]
    const placeholderChunk = placeholder.substring(0, this.charIdx+1)
    document.querySelector(this.element).setAttribute("placeholder", this.options.preText + " " + placeholderChunk)
  }

  onTickReverse(afterReverse) {
    if (this.charIdx === 0) {
      afterReverse.bind(this)()
      clearInterval(this.intervalId) 
      this.init() 
    } else {
      this.setPlaceholder()
      this.charIdx--
    }
  }

  goReverse() {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(this.onTickReverse.bind(this, function() {
      this.charIdx = 0
      this.placeholderIdx++
      if (this.placeholderIdx === this.options.placeholders.length) {
        // end of all placeholders reached
        this.placeholderIdx = 0
      }
    }), this.options.speed)
  }

  onTick() {
    var placeholder = this.options.placeholders[this.placeholderIdx]
    if (this.charIdx === placeholder.length) {
      // end of a placeholder sentence reached
      setTimeout(this.goReverse.bind(this), this.options.stay)
    }
    
    this.setPlaceholder()
  
    this.charIdx++
  }

  init() {
    this.intervalId = setInterval(this.onTick.bind(this), this.options.speed)
  }
  
  kill() {
    clearInterval(this.intervalId)
  }
}
