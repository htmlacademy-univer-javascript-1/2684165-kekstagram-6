function checkStringLength(str, maxLength) {
    return str.length <= maxLength;
}

checkStringLength('проверяемая строка', 20) 

checkStringLength('проверяемая строка', 18) 

checkStringLength('проверяемая строка', 10) 