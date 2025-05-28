document.addEventListener('DOMContentLoaded', () => {
    const enhet = document.querySelector('#enhet')
    const fra = document.querySelector('#fra')
    const til = document.querySelector('#til')
    const fraNumber = document.querySelector('#fra-number')
    const tilNumber = document.querySelector('#til-number')    


    /* Datatable fra gemini, noway at eg leite ette alle formlane. har begrensa litt 
    antall forskjellige måleenheta.
    toBase og fromBase er for å konvertere til baseUnit for å slippe å konvertere 
    alle til kverandre. så hvis du skal konvertere fra feet til inch, så 
    konverteres det fra feet til meter, og så fra meter til inch.
    dette funker ikkje for temperatur, så derfor har eg ikkje tatt temp med i kalkulatoren min.
    */ 
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

    // function for å lage dropdown i <select> elemente "#til" og "#fra".
    function dropDownUnits (selectedUnits) {
        // fjerne tidligare dropdown <option(s)>.
        fra.innerHTML = ''
        til.innerHTML = ''
        // sjekke om du har valgt ein måleenhet i <select> "#enhet"
        if (selectedUnits && data[selectedUnits]) {
            data[selectedUnits].units.forEach(item => {
                // lage <option> i "#fra"
                const fraOption = document.createElement('option')
                // hente item valuen og text fra datatable
                fraOption.value = item.value
                fraOption.textContent = item.text
                fra.appendChild(fraOption)

                // lage <option> i "#til"
                const tilOption = document.createElement('option')
                tilOption.value = item.value
                tilOption.textContent = item.text
                til.appendChild(tilOption)
            })
        }
        // velge dei to første <option> i kvart felt automatisk.
        fra.value = data[selectedUnits].units[0].value
        til.value = data[selectedUnits].units[1].value
    }
    
    
    // TODO: laga input/output ut i fra kor eg skrive inn tallena??
    
    function convert() {
        const selectedEnhetType = enhet.value
        const fromUnit = fra.value
        const toUnit = til.value
        const inputValueFra = parseFloat(fraNumber.value)
        const inputValueTil = parseFloat(tilNumber.value)
        // sjekke om du har valgt måleenhet og units og om inputvalue e et gyldig nr.
        // if (isNaN(inputValueFra) || isNaN(inputValueTil) || !selectedEnhetType || !fromUnit || !toUnit) {
        //     tilNumber.value = ''
        //     return;
        // } 
        
        let result;
        let einboolean = false
        let toboolean = false
        if (fraNumber.value > 0) {
            toboolean = true
        } 
        console.log(fraNumber)
        console.log(toboolean + ' fra input')
            const categoryData = data[selectedEnhetType]
            // her hente den talle du har skreve inn i input felte.
            const fromUnitData = categoryData.units.find(unit => unit.value === fromUnit)
            const toUnitData = categoryData.units.find(unit => unit.value === toUnit)
        // utføre konverteringe her.
            if (fromUnitData && toUnitData && toboolean) {
                const valueInBaseUnit = fromUnitData.toBase(inputValueFra)
                result = toUnitData.fromBase(valueInBaseUnit)
                einboolean = false
            }   else if (fromUnitData && toUnitData && !toboolean) {
                const valueInBaseUnit = toUnitData.toBase(inputValueTil)
                result = fromUnitData.fromBase(valueInBaseUnit)
                einboolean = true
            }
            console.log(einboolean + ' fra "til" - "fra"')
        /* sjekke at result ikkje e undefined og ikkje e NaN og så returnere resultate i "#til" 
        inputfelte med 2 desimala. hvis result e udefinert eller NaN, så returnere da "ERROR".*/
        if (result !== undefined && !isNaN(result) && !einboolean) {
            tilNumber.value = result.toFixed(2)
        } else if (result !== undefined && !isNaN(result) && einboolean) {
            fraNumber.value = result.toFixed(2)
        } else {
            tilNumber.value = 'ERROR'
        }
    }
    

    /* når du bytte <option> i "#enhet" <select> elemente så får "selectedEnhet" ein verdi f.eks. "lengde"
    fra datatable, og gir den verdien til dropDownUnits funksjonen sånn at den veit kalla <option(s)> 
    som skal bli laga i "#fra" og "#til" <select> elementena. og utføre konverteringe 
    med ein gong hvis du allerede har skreve inn nåken tall. */
    enhet.addEventListener('change', function() {
        const selectedEnhet = this.value
        dropDownUnits(selectedEnhet)
        convert()
    })

    /* utføre convert funksjonen når du endre verdien i input eller når du bytte måleunit, sånn at 
    konverteringe skjer instantly i kalkulatoren. */
    fra.addEventListener('change', convert)
    til.addEventListener('change', convert)
    fraNumber.addEventListener('input', () => {
        setTimeout(convert, 1000)
    })
    tilNumber.addEventListener('input', () => {
        setTimeout(convert, 1000)
    })

})