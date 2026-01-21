
/**
 * expects a number as param and returns the comma separated equivalent string of the number
 * **/
const formatNumberAsCommaSeparatedNumberString = (number) => {
    try{
        let numberString = number.toString();
        const length = numberString.length;

        if(length <= 3)
        {
            return numberString;
        }

        let chunks = [];

        for(let index = length; index > 0; index -= 3)
        {
            
            if(index <= 3 )
            {
                chunks.push(numberString.slice(0, index));
            }
            else
            {
                chunks.push(numberString.slice(index - 3, index));
            }
            
        }

        let result = "";
        while(chunks.length > 0)
        {
            if(result === "")
                result = `${chunks.pop()}`;

            result = `${result},${chunks.pop()}`;
        }
        return result;
    }catch(error)
    {
        console.error(error);
        return number;
    }
};


export {
    formatNumberAsCommaSeparatedNumberString
};