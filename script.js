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
                { value: 'meter', text: 'Meters (M)', toBase: (val) => val, fromBase: (val) => val },
                { value: 'mm', text: 'Millimeters (mm)', toBase: (val) => val / 1000, fromBase: (val) => val * 1000 },
                { value: 'cm', text: 'Centimeters (cm)', toBase: (val) => val / 100, fromBase: (val) => val * 100 },
                { value: 'km', text: 'Kilometers (km)', toBase: (val) => val * 1000, fromBase: (val) => val / 1000 },
                { value: 'inch', text: 'Inches (in)', toBase: (val) => val * 0.0254, fromBase: (val) => val / 0.0254 },
                { value: 'feet', text: 'Feet (ft)', toBase: (val) => val * 0.3048, fromBase: (val) => val / 0.3048 },
                { value: 'yard', text: 'Yards (yd)', toBase: (val) => val * 0.9144, fromBase: (val) => val / 0.9144 },
                { value: 'mile', text: 'Miles (mi)', toBase: (val) => val * 1609.34, fromBase: (val) => val / 1609.34 }
            ]
        },
        vekt: {
            baseUnit: 'kg',
            units: [
                { value: 'kg', text: 'Kilograms(kg)', toBase: (val) => val, fromBase: (val) => val },
                { value: 'gram', text: 'Grams (g)', toBase: (val) => val / 1000, fromBase: (val) => val * 1000 },
                { value: 'tonn', text: 'Tonns (t)', toBase: (val) => val * 1000, fromBase: (val) => val / 1000 },
                { value: 'pounds', text: 'Pounds (lb)', toBase: (val) => val * 0.45359237, fromBase: (val) => val / 0.45359237 },
                { value: 'stone', text: 'stone', toBase: (val) => val * 6.35029, fromBase: (val) => val / 6.35029 }
            ]
        },
        volum: {
            baseUnit: 'liter',
            units: [
                { value: 'liter', text: 'Liter (l)', toBase: (val) => val, fromBase: (val) => val },
                { value: 'ml', text: 'Milliliters (ml)', toBase: (val) => val / 1000, fromBase: (val) => val * 1000 },
                { value: 'cl', text: 'Centiliters (cl)', toBase: (val) => val / 100, fromBase: (val) => val * 100 },
                { value: 'dl', text: 'Deciliters (dl)', toBase: (val) => val / 10, fromBase: (val) => val * 10 },
                { value: 'gallons', text: 'US gallons (gal)', toBase: (val) => val * 3.785411784, fromBase: (val) => val / 3.785411784 }
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
    
    
    // konvertere fra venstre felt til høgre. 
    function convertFrom() {
        const selectedEnhetType = enhet.value
        const fromUnit = fra.value
        const toUnit = til.value
        const inputValueFra = parseFloat(fraNumber.value)
        const categoryData = data[selectedEnhetType]
        const fromUnitData = categoryData.units.find(unit => unit.value === fromUnit)
        const toUnitData = categoryData.units.find(unit => unit.value === toUnit)
        // sjekke om du har valgt måleenhet og units og om inputvalue e et gyldig nr.
        if (isNaN(inputValueFra) || !selectedEnhetType || !fromUnit || !toUnit) {
            tilNumber.value = ''
            return;
        } 
        
        // her hente den talle du har skreve inn i input felte.
        // utføre konverteringe her.
        if (fromUnitData && toUnitData) {
            const valueInBaseUnit = fromUnitData.toBase(inputValueFra)
            result = toUnitData.fromBase(valueInBaseUnit)
        }
        /* sjekke at result ikkje e undefined og ikkje e NaN og så returnere resultate i "#til" 
        inputfelte med 2 desimala. hvis result e udefinert eller NaN, så returnere da "ERROR".*/
        if (result !== undefined && !isNaN(result)) {
            tilNumber.value = result
        } else {
            tilNumber.value = 'ERROR'
        }
    }

    // konvertere fra høgre felt til venstre
    function convertTo() {
        const selectedEnhetType = enhet.value
        const fromUnit = fra.value
        const toUnit = til.value
        const inputValueTil = parseFloat(tilNumber.value)
        const categoryData = data[selectedEnhetType]
        const fromUnitData = categoryData.units.find(unit => unit.value === fromUnit)
        const toUnitData = categoryData.units.find(unit => unit.value === toUnit)
        // sjekke om du har valgt måleenhet og units og om inputvalue e et gyldig nr.
        if (isNaN(inputValueTil) || !selectedEnhetType || !fromUnit || !toUnit) {
            fraNumber.value = ''
            return;
        } 
        
        // her hente den talle du har skreve inn i input felte.
        // utføre konverteringe her.
         if (fromUnitData && toUnitData) {
         const valueInBaseUnit = toUnitData.toBase(inputValueTil)
         result = fromUnitData.fromBase(valueInBaseUnit)
         }
        /* sjekke at result ikkje e undefined og ikkje e NaN og så returnere resultate i "#til" 
        inputfelte med 2 desimala. hvis result e udefinert eller NaN, så returnere da "ERROR".*/

        if (result !== undefined && !isNaN(result)) {
            fraNumber.value = result
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
        convertFrom()
    })

    /* utføre convert funksjonen når du endre verdien i input eller når du bytte måleunit, sånn at 
    konverteringe skjer instantly i kalkulatoren. */
    fra.addEventListener('change', convertFrom)
    til.addEventListener('change', convertFrom)
    fraNumber.addEventListener('input', convertFrom)
    tilNumber.addEventListener('input', convertTo)

})