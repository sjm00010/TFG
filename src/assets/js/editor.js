/**
 * La etiqueta de inicio y fin deben ser distintas
 * La función añade o encapsula la opción que soluciona el usuario
 * @param {*} sStartTag 
 * @param {*} sEndTag 
 * @param {*} area 
 */
export function insertaCaracteres(sStartTag, sEndTag, area) {
    const oMsgInput = area, nSelStart = oMsgInput.selectionStart, nSelEnd = oMsgInput.selectionEnd, sOldText = oMsgInput.value;
    oMsgInput.value = sOldText.substring(0, nSelStart) + sStartTag + sOldText.substring(nSelStart, nSelEnd) + sEndTag + sOldText.substring(nSelEnd);
    oMsgInput.setSelectionRange( nSelStart + sStartTag.length, nSelEnd + sStartTag.length);
    oMsgInput.focus();
}