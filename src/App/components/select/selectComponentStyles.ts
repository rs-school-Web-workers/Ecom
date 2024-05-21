export const styles = `
:host {
  display: flex;
  justify-content: center;
  width: 100%;
}
.select {
  margin-top: 2px;
  width: 100%;
  font-size: clamp(0.8rem, 2vw, 1rem);
  font-family: Satoshi;
}
.select__value {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 8px;
  padding: 12px;
  background-color: white;
  border: 2px solid #D9D9D9;
}
.select__value:has(.select__value-placeholder):has(.placeholder.selected) {
  border-color: #6fcf97;
}

.select__value.active {
  border-color: #003bde;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.select__value-placeholder {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.select__value:hover {
  cursor: pointer;
}

.placeholder {
  color: grey;
  padding: 1.80px;
}

.chevron.active::before {
  top: 6px;
  transform: rotate(-45deg);
}
.chevron::before {
  border-style: solid;
	border-width: 0.25em 0.25em 0 0;
	content: '';
	display: inline-block;
	height: 0.45em;
	left: -2px;
	position: relative;
	top: 3px;
  transform: rotate(135deg);
	vertical-align: top;
	width: 0.45em;
}

.placeholder.selected {
  color: #0b132b;
}

.select__list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: scroll;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  padding: 10px 0;
}

.select__list-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 12px;
}

.select__list-item:hover {
  background-color: #003bde;
  color: white;
  cursor: pointer;
}

.select__list-item_fullname {
  font-weight: 600;
}

.select__list-item_shortname {
  font-weight: 400;
  font-size: 13px;
  color: #9b9fa8;
}

.hide {
  display: none;
}`;
