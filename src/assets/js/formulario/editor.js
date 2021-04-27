/**
 * La función añade o encapsula la opción que selecciona el usuario
 * La etiqueta de inicio y fin deben ser distintas
 * @param {String} sStartTag Inicio de la etiqueta
 * @param {String} sEndTag Fin de la etiqueta
 * @param {*} area 
 */
export function insertaCaracteres(sStartTag, sEndTag, area) {
    const oMsgInput = area, nSelStart = oMsgInput.selectionStart, nSelEnd = oMsgInput.selectionEnd, sOldText = oMsgInput.value;
    oMsgInput.value = sOldText.substring(0, nSelStart) + sStartTag + sOldText.substring(nSelStart, nSelEnd) + sEndTag + sOldText.substring(nSelEnd);
    oMsgInput.setSelectionRange( nSelStart + sStartTag.length, nSelEnd + sStartTag.length);
    oMsgInput.focus();
}