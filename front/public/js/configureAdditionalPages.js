const spellsPage = document.getElementById("spellsPage");
const equipmentPage = document.getElementById("equipmentPage");

function configureAdditionalPages() {
  spellsPage.innerHTML = `
	<div id="mainSpellsDiv">
      <div id="spellsCenter">
        <div id="leftSpells">
          <span class="spellLevel" id="sl0">0</span>
          <span class="spellLevel" id="sl1">1</span>
					<div class="spellsQuantityTrackingDiv" id="SQT1">
						<input class="maxSpellCellsInput" type="number" placeholder="Max">
						<div><span>Потрачено: </span><input class="spentSpellCellsInput" type="number" placeholder="0"></div>
					</div>
          <span class="spellLevel" id="sl2">2</span>
					<div class="spellsQuantityTrackingDiv" id="SQT2">
						<input class="maxSpellCellsInput" type="number" placeholder="Max">
						<div><span>Потрачено: </span><input class="spentSpellCellsInput" type="number" placeholder="0"></div>
					</div>
          <div id="spellsLevel0" class="spellsLevelDivs">
            <ul class="spellsList" id="spellsList0"></ul>
            <button id="addSpell0" class="addObtainedSpellButton">+</button>
          </div>
          <div id="spellsLevel1" class="spellsLevelDivs">
            <ul class="spellsList" id="spellsList1"></ul>
            <button id="addSpell1" class="addObtainedSpellButton">+</button>
          </div>
          <div id="spellsLevel2" class="spellsLevelDivs">
            <ul class="spellsList" id="spellsList2"></ul>
            <button id="addSpell2" class="addObtainedSpellButton">+</button>
          </div>
        </div>

        <div id="centerSpells">
          <span class="spellLevel" id="sl3">3</span>
					<div class="spellsQuantityTrackingDiv" id="SQT3">
						<input class="maxSpellCellsInput" type="number" placeholder="Max">
						<div><span>Потрачено: </span><input class="spentSpellCellsInput" type="number" placeholder="0"></div>
					</div>
          <span class="spellLevel" id="sl4">4</span>
					<div class="spellsQuantityTrackingDiv" id="SQT4">
						<input class="maxSpellCellsInput" type="number" placeholder="Max">
						<div><span>Потрачено: </span><input class="spentSpellCellsInput" type="number" placeholder="0"></div>
					</div>
          <span class="spellLevel" id="sl5">5</span>
					<div class="spellsQuantityTrackingDiv" id="SQT5">
						<input class="maxSpellCellsInput" type="number" placeholder="Max">
						<div><span>Потрачено: </span><input class="spentSpellCellsInput" type="number" placeholder="0"></div>
					</div>
          <div id="spellsLevel3" class="spellsLevelDivs">
            <ul class="spellsList" id="spellsList3"></ul>
            <button id="addSpell3" class="addObtainedSpellButton">+</button>
          </div>
          <div id="spellsLevel4" class="spellsLevelDivs">
            <ul class="spellsList" id="spellsList4"></ul>
            <button id="addSpell4" class="addObtainedSpellButton">+</button>
          </div>
          <div id="spellsLevel5" class="spellsLevelDivs">
            <ul class="spellsList" id="spellsList5"></ul>
            <button id="addSpell5" class="addObtainedSpellButton">+</button>
          </div>
        </div>

        <div id="rightSpells">
          <span class="spellLevel" id="sl6">6</span>
					<div class="spellsQuantityTrackingDiv" id="SQT6">
						<input class="maxSpellCellsInput" type="number" placeholder="Max">
						<div><span>Потрачено: </span><input class="spentSpellCellsInput" type="number" placeholder="0"></div>
					</div>
          <span class="spellLevel" id="sl7">7</span>
					<div class="spellsQuantityTrackingDiv" id="SQT7">
						<input class="maxSpellCellsInput" type="number" placeholder="Max">
						<div><span>Потрачено: </span><input class="spentSpellCellsInput" type="number" placeholder="0"></div>
					</div>
          <span class="spellLevel" id="sl8">8</span>
					<div class="spellsQuantityTrackingDiv" id="SQT8">
						<input class="maxSpellCellsInput" type="number" placeholder="Max">
						<div><span>Потрачено: </span><input class="spentSpellCellsInput" type="number" placeholder="0"></div>
					</div>
          <span class="spellLevel" id="sl9">9</span>
					<div class="spellsQuantityTrackingDiv" id="SQT9">
						<input class="maxSpellCellsInput" type="number" placeholder="Max">
						<div><span>Потрачено: </span><input class="spentSpellCellsInput" type="number" placeholder="0"></div>
					</div>
          <div id="spellsLevel6" class="spellsLevelDivs">
            <ul class="spellsList" id="spellsList6"></ul>
            <button id="addSpell6" class="addObtainedSpellButton">+</button>
          </div>
          <div id="spellsLevel7" class="spellsLevelDivs">
            <ul class="spellsList" id="spellsList7"></ul>
            <button id="addSpell7" class="addObtainedSpellButton">+</button>
          </div>
          <div id="spellsLevel8" class="spellsLevelDivs">
            <ul class="spellsList" id="spellsList8"></ul>
            <button id="addSpell8" class="addObtainedSpellButton">+</button>
          </div>
          <div id="spellsLevel9" class="spellsLevelDivs">
            <ul class="spellsList" id="spellsList9"></ul>
            <button id="addSpell9" class="addObtainedSpellButton">+</button>
          </div>
        </div>
      </div>

      <div id="spellsOfCurrentLevelDiv">
        <button id="spellsOfCurrentLevelCloseButton">X</button>
        <ul id="spellsOfCurrentLevelUl"></ul>
      </div>

			<div id="customSpellsCreator" style="display: none;">
				<span id="customSpellName">Имя: Кастомное заклинание</span>
				<div id="customSpellDamageDiv">
					<div>
						<span>Тип урона: </span>
						<select id="customSpellDamageSelect">
							<option value=""></option>
							<option value="Дробящий">Дробящий</option>
							<option value="Колющий">Колющий</option>
							<option value="Режущий">Режущий</option>
							<option value="Холод">Холод</option>
							<option value="Огонь">Огонь</option>
							<option value="Электрический">Электрический</option>
							<option value="Гром">Гром</option>
							<option value="Кислота">Кислота</option>
							<option value="Яд">Яд</option>
							<option value="Лучистый">Лучистый</option>
							<option value="Некротический">Некротический</option>
							<option value="Сила">Сила</option>
							<option value="Психический">Психический</option>
							<option value="Усиление">Усиление</option>
						</select>
					</div>
					<ul id="customSpellDamageUl">
						<li id="customSpellDamageLi1"><span>1: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi2"><span>2: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi3"><span>3: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi4"><span>4: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi5"><span>5: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi6"><span>6: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi7"><span>7: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi8"><span>8: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi9"><span>9: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi10"><span>10: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi11"><span>11: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi12"><span>12: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi13"><span>13: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi14"><span>14: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi15"><span>15: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi16"><span>16: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi17"><span>17: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi18"><span>18: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi19"><span>19: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
						<li id="customSpellDamageLi20"><span>20: </span><input class="customSpellDamageInput" type="text" autocomplete="off" placeholder="1d4"></li>
					</ul>
				</div>

				<div id="customSpellDescriptionDiv">
					<textarea id="customSpellDescription" autocomplete="off" style="resize: none; width: 29.7vw; height: 10vw;"></textarea>
				</div>

				<div id="customSpellDurationDiv">
					<span id="customSpellDurationText">Длительность: </span>
					<input type="text" id="customSpellDuration" autocomplete="off" placeholder="Мгновенная"/>
				</div>
				<div id="customSpellRangeDiv">
					<span id="customSpellRangeText">Дальность: </span>
					<input type="text" id="customSpellRange" autocomplete="off" placeholder="10 футов"/>
				</div>
				<div id="customSpellTimeDiv">
					<span id="customSpellTimeText">Время использования: </span>
					<input type="text" id="customSpellTime" autocomplete="off" placeholder="Бонусное действие"/>
				</div>
				<div id="customSpellLevelSelectDiv">
					<span id="customSpellLevelSelectText">Уровень ячейки заклинания: </span>
					<span id="customSpellLevelSelect"></span>
				</div>

				<div id="customSpellButtonsDiv">
					<button id="confirmCustomSpellButton">Добавить заклинание</button>
					<button id="cancelCustomSpellButton">Отмена</button>
				</div>
			</div>
    </div>
	`;

  equipmentPage.innerHTML = `
		<div id="mainEquipmentPage">
			<div id="centerEquipmentDiv">
				<div id="textareasDiv">
					<div id="leftEquipmentDiv">
						<textarea id="leftEquipmentText" autocomplete="off" style="resize: none; width: 80%; height: 90%;"></textarea>
					</div>
					<div id="rightEquipmentDiv">
						<textarea id="rightEquipmentText" autocomplete="off" style="resize: none; width: 80%; height: 90%;"></textarea>
					</div>
				</div>
				<div id="bottomEquipmentDiv">
					<div>
						<input type="text" autocomplete="off" id="copperMoney" placeholder="0">
						<span>ММ</span>
					</div>
					<div>
						<input type="text" autocomplete="off" id="silverMoney" placeholder="0">
						<span>СМ</span>
					</div>
					<div>
					<input type="text" autocomplete="off" id="goldMoney" placeholder="0">
					<span>ЗМ</span>
					</div>
					<div>
					<input type="text" autocomplete="off" id="platinumMoney" placeholder="0">
					<span>ПМ</span>
					</div>
				</div>
			</div>
		</div>
	`;
}

configureAdditionalPages();
