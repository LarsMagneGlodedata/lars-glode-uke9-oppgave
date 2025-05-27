document.addEventListener('DOMContentLoaded', () => {
    const enhet = document.querySelector('#enhet')
    const fra = document.querySelector('#fra')
    const til = document.querySelector('#til')
    const fraNumber = document.querySelector('#fra-number')
    const tilNumber = document.querySelector('#til-number')    


    // Datatable fra gemini, noway at eg leite ette alle formlane. har begrensa litt antall forskjellige måleenheta
    const data = {
        lengde: {
            baseUnit: 'meter', 
            units: [
                { value: 'cm', text: 'cm', toBase: (val) => val / 100, fromBase: (val) => val * 100 },
                { value: 'meter', text: 'meter', toBase: (val) => val, fromBase: (val) => val },
                { value: 'inch', text: 'tommer', toBase: (val) => val * 0.0254, fromBase: (val) => val / 0.0254 },
                { value: 'feet', text: 'feet', toBase: (val) => val * 0.3048, fromBase: (val) => val / 0.3048 }
            ]
        },
        vekt: {
            baseUnit: 'kg',
            units: [
                { value: 'gram', text: 'gram', toBase: (val) => val / 1000, fromBase: (val) => val * 1000 },
                { value: 'kg', text: 'kg', toBase: (val) => val, fromBase: (val) => val },
                { value: 'pund', text: 'pund', toBase: (val) => val * 0.453592, fromBase: (val) => val / 0.453592 },
                { value: 'stone', text: 'stone', toBase: (val) => val * 6.35029, fromBase: (val) => val / 6.35029 }
            ]
        },
        volum: {
            baseUnit: 'liter',
            units: [
                { value: 'liter', text: 'liter', toBase: (val) => val, fromBase: (val) => val },
                { value: 'ml', text: 'milliliter', toBase: (val) => val / 1000, fromBase: (val) => val * 1000 },
                { value: 'gallons', text: 'gallons', toBase: (val) => val * 3.78541, fromBase: (val) => val / 3.78541 }
            ]
        }
    };

    
    function dropDownUnits (selectedUnits) {
        fra.innerHTML = ''
        til.innerHTML = ''
        
        if (selectedUnits && data[selectedUnits]) {
            data[selectedUnits].units.forEach(item => {
                const fraOption = document.createElement('option')
                fraOption.value = item.value
                fraOption.textContent = item.text
                fra.appendChild(fraOption)

                const tilOption = document.createElement('option')
                tilOption.value = item.value
                tilOption.textContent = item.text
                til.appendChild(tilOption)
            })
        }
            fra.value = data[selectedUnits].units[0].value
            til.value = data[selectedUnits].units[1].value
    }

    
        // TODO: laga input/output ut i fra kor eg skrive inn tallena.
    
    function convert() {
        const selectedEnhetType = enhet.value
        const fromUnit = fra.value
        const toUnit = til.value
        const inputValue = parseFloat(fraNumber.value)
        if (isNaN(inputValue) || !selectedEnhetType || !fromUnit || !toUnit) {
            tilNumber = ''
            return;
        } 
        
        let result;

        if (selectedEnhetType === 'temperatur') {
            result = convertTemperatur(inputValue, fromUnit, toUnit)
        } else {
            const categoryData = data[selectedEnhetType]
            const fromUnitData = categoryData.units.find(unit => unit.value === fromUnit)
            const toUnitData = categoryData.units.find(unit => unit.value === toUnit)

            if (fromUnitData && toUnitData) {
                const valueInBaseUnit = fromUnitData.toBase(inputValue)
                result = toUnitData.fromBase(valueInBaseUnit)
            }
        }
        if (result !== undefined && !isNaN(result)) {
            tilNumber.value = result.toFixed(2)
        } else {
            tilNumber.value = 'ERROR'
        }
        
        
    }

    enhet.addEventListener('change', function() {
        const selectedEnhet = this.value
        dropDownUnits(selectedEnhet)
    })

    fra.addEventListener('change', convert)
    til.addEventListener('change', convert)
    fraNumber.addEventListener('input', convert)
    tilNumber.addEventListener('input', convert)




})