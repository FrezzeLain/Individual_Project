/**
 * Начальные переменные
 *
 *  {MainBlockOfTheGame} - Основной блок, с которым взаимодействует пользователь.
 *  {FileInput} - Загрузчик картинки.
 *  {PlayButton} Кнопка - начало игры.
 *  {ReloadButton} Кнопка - рандомная отрисовка частей картинки.
 *  {SurrenderButton} Кнопка - сдаться.
 *  {StartMassivOfElements} - Массив, в который заносятся начальные элементы в начале игры.
 *  {CurrentDifficulty} - Элемент, содержащий в себе текущую сложность.
 *  {Next} - Кнопка "Далее".
 *  {settings} - Блок с настройками игры.
 *  {PlayAgain} - Кнопка "Начать заново" (Ещё раз)
 *  {ResultH1} - Блок, в котором отображается результат игры (Сдался \ Выиграл)
 *  {Again} - Блок, соеражщий в себе Result и PlayAgain.
 *  {RandomMassivOfElements} - Массив, содержащий текущий образ рандомного расположения элементов.
 *  {IsFirstClick} - Флаговая переменная. В зависимости от неё функция ChangePlace ведёт себя по разному.
 *  {PrevElement} - Переменная, в которой содержится последний элемент паззла, по которому произошло нажатие.
 */
var MainBlockOfTheGame = document.getElementById('MainBlock');
var FileInput = document.getElementById('NewImage');
var PlayButton = document.getElementById('Play');
var ReloadButton = document.getElementById('Reload');
var SurrenderButton = document.getElementById('Surrender');
var CurrentDifficulty = document.getElementById('SelectAmount');
var Next = document.getElementById('NextButton');
var settings = document.getElementById('settings');
var PlayAgain = document.getElementById('PlayAgain');
var ResultH1 = document.getElementById('Result');
var Again = document.getElementById('Again');
var StartMassivOfElements = [];
var RandomMassivOfElements = [];
var IsFirstClick = true;
var PrevElement;
/* EventListeners */
FileInput.addEventListener('change', function (ev) {
    StartMassivOfElements.length = 0; /* Обнуление массива на случай, если пользователь начнёт заново */
    var File = FileInput.files[0]; /* Считывание файла пользователя */
    var Reader = new FileReader();
    Reader.readAsDataURL(File);
    Reader.onload = function () {
        var AmountItems = Number(CurrentDifficulty.value); /* Получение текущей сложности */
        var CurrentStyles = GetCurrentStyles(AmountItems); /* Получени стилей в зависимости от сложности */
        StartMassivOfElements = GenerateNewImage(AmountItems, CurrentStyles, Reader.result); /* Генерация нового массива */
        RenderBlocks(StartMassivOfElements); /* Отрисовка массива */
        /* Изменение стилей различных элементов */
        FileInput.classList.add('invisible');
        ReloadButton.classList.remove('invisible');
        MainBlockOfTheGame.classList.remove('invisible');
        settings.style.left = "75%";
    };
});
ReloadButton.addEventListener('click', function () {
    var CurrentLength = StartMassivOfElements.length;
    RandomMassivOfElements.length = 0;
    for (var index = 0; index < CurrentLength; index++) {
        var flag = false;
        while (flag == false) {
            var Random = RandomNumber(0, CurrentLength - 1);
            var RandomDiv = document.getElementById("i" + Random);
            if (RandomMassivOfElements.indexOf(RandomDiv) !== -1) {
                /* Элемент уже есть в массиве */
            }
            else {
                RandomMassivOfElements.push(RandomDiv);
                flag = !flag;
            }
        }
    }
    MainBlockOfTheGame.innerHTML = '';
    RenderBlocks(RandomMassivOfElements);
    if (PlayButton.classList.contains('invisible')) {
        PlayButton.classList.remove('invisible');
    }
});
PlayButton.addEventListener('click', function () {
    AddListen(MainBlockOfTheGame);
    ReloadButton.classList.add('invisible');
    PlayButton.classList.add('invisible');
    SurrenderButton.classList.remove('invisible');
    CurrentDifficulty.classList.add('invisible');
});
Next.addEventListener('click', function () {
    if (!CurrentDifficulty.classList.contains('invisible')) {
        CurrentDifficulty.classList.add('invisible');
        FileInput.classList.remove('invisible');
        Next.classList.add('invisible');
    }
});
SurrenderButton.addEventListener('click', function () {
    endGame();
});
PlayAgain.addEventListener('click', function () {
    endGame();
});
/* Конец EventListeners */
/* Методы */
/**
 * Генерация новых блоков при загрузке новой картинки.
 * @AmountItems {number} Кол - во генерируемых блоков.
 * @ElementsStyles {number} Ширина и высота каждого элемента в пикселях.
 * @BackImage {string} Картинка пользователя.
 * @returns Возвращает массив с элементами.
 */
function GenerateNewImage(AmountItems, ElementsStyles, BackImage) {
    var ResultMassiv = []; /* Объявление массива */
    for (var index = 0; index < AmountItems; index++) { /* Перебор каждого элемента */
        var DivElement = document.createElement('div'); /* Создание нового элемента */
        DivElement.className = 'PieceOfImage absolute'; /* Добавление классов элементу */
        DivElement.style.width = DivElement.style.height = ElementsStyles + "px"; /* Позиционирование элемента */
        DivElement.style.backgroundImage = "url(" + BackImage + ")"; /* Ставим картинку пользовтаеля на зданий фон */
        DivElement.id = "i" + index; /* Присваиваем блоку ID */
        ResultMassiv.push(DivElement); /* Добавляем элемент в массив */
    }
    return ResultMassiv; /* Возвращаем получившийся массив */
}
/**
 * Функция для получния ширины и высоты каждого элемента в игре.
 * Возвращает число - ширину и высоту в пикселях.
 *
 * @AmountItems {number} Кол - во элементов в игре.
 */
/* Ширина и высота поля постоянная - 600px */
function GetCurrentStyles(AmountItems) {
    if (AmountItems == 9) {
        return 200;
    }
    if (AmountItems == 16) {
        return 150;
    }
    return 120;
}
/**
 * Функция отрисовки блоков внутри MainBlock
 *
 * @Massiv Входящий массив элементов.
 */
function RenderBlocks(Massiv) {
    var CountElements = Massiv.length;
    var WidhtAndHeight = getWidthOfElement(Massiv[0]);
    var CountInRow = Math.sqrt(CountElements);
    var i = 0;
    Massiv.forEach(function (DIV) {
        i++;
        /* Положение элемента в зависимтости от его очереди в массиве */
        var Id = getIDofElement(DIV) + 1;
        var CurrentRow = Math.ceil(i / CountInRow);
        var CurrentColumn = getColumn(i, CountInRow, CurrentRow);
        var CurrentX = (CurrentColumn - 1) * WidhtAndHeight;
        var CurrentY = (CurrentRow - 1) * WidhtAndHeight;
        DIV.style.left = CurrentX + "px";
        DIV.style.top = CurrentY + "px";
        /* Задний фон блока в зависимости от его ID */
        var CurrentRowForBack = Math.ceil(Id / CountInRow);
        var CurrentColumnForBack = getColumn(Id, CountInRow, CurrentRowForBack);
        var CurrentXForBack = (CurrentColumnForBack - 1) * WidhtAndHeight;
        var CurrentYForBack = (CurrentRowForBack - 1) * WidhtAndHeight;
        DIV.style.backgroundPosition = "left -" + CurrentXForBack + "px top -" + CurrentYForBack + "px";
        /* Добавить блок на страницу */
        MainBlockOfTheGame.append(DIV);
    });
}
/**
 * Функция вычисления текущей колонки.
 *
 * @id Id теущего элемента.
 * @CountInRow Кол - во элементов в строке.
 * @CurrentRow Текущая строка.
 */
function getColumn(id, CountInRow, CurrentRow) {
    if (id % CountInRow === 0) {
        return CountInRow;
    }
    ;
    if (id === 1) {
        return 1;
    }
    ;
    return id - ((CurrentRow - 1) * CountInRow);
}
/**
 * Получние ID Div - эелемента (Частички паззла).
 *
 * @Element Div - элемент.
 * @returns Id в числовом формате.
 */
function getIDofElement(Element) {
    var IdToArray = Element.id.split('');
    IdToArray[0] = '';
    var Result = Number(IdToArray.join(''));
    return Result;
}
/**
 * Получение Width элемента в числовом формате.
 *
 * @Element DOM - элемент.
 */
function getWidthOfElement(Element) {
    var WidthArray = Element.style.width.split('');
    WidthArray.length = WidthArray.length - 2;
    var Result = Number(WidthArray.join(''));
    return Result;
}
/**
 *  Функция для получения случайного числа от min до max.
 */
function RandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Функция, добвляющая EventListener на элемент.
 *
 * @DIV Элемент, который мы прослушиваем.
 */
function AddListen(DIV) {
    DIV.addEventListener('click', function (evnt) {
        ChangePlace(evnt);
    });
}
/**
 * Функция смены позиций у элементов "Паззла".
 *
 * @Evnt Событие на главном блоке.
 */
function ChangePlace(Evnt) {
    if (IsFirstClick) {
        PrevElement = Evnt.path[0];
        IsFirstClick = !IsFirstClick;
    }
    else {
        var CurrentItem = Evnt.path[0];
        var CurrentX = CurrentItem.style.left;
        var CurrentY = CurrentItem.style.top;
        CurrentItem.style.left = PrevElement.style.left;
        CurrentItem.style.top = PrevElement.style.top;
        PrevElement.style.left = CurrentX;
        PrevElement.style.top = CurrentY;
        var LengthC = RandomMassivOfElements.length;
        var oldId = void 0, newId = void 0;
        for (var index = 0; index < LengthC; index++) {
            if (PrevElement.id === RandomMassivOfElements[index].id) {
                oldId = index;
                break;
            }
        }
        for (var j = 0; LengthC; j++) {
            if (CurrentItem.id === RandomMassivOfElements[j].id) {
                newId = j;
                break;
            }
        }
        RandomMassivOfElements[oldId] = CurrentItem;
        RandomMassivOfElements[newId] = PrevElement;
        var Result = CheckMassivs(RandomMassivOfElements, StartMassivOfElements);
        if (Result) {
            MainBlockOfTheGame.innerHTML = '';
            var Clone = MainBlockOfTheGame.cloneNode(true);
            document.body.removeChild(MainBlockOfTheGame);
            MainBlockOfTheGame = Clone;
            document.body.appendChild(Clone);
            MainBlockOfTheGame.classList.add('invisible');
            SurrenderButton.classList.add('invisible');
            ResultH1.innerText = 'Вы выиграли!';
            Again.classList.remove('invisible');
            Again.classList.add('flex');
        }
        IsFirstClick = !IsFirstClick;
    }
}
/**
 * Функция проверки двух массивов.
 *
 * @Old Первый массив.
 * @New Второй массив.
 *
 *@returns boolean
 */
function CheckMassivs(Old, New) {
    if (Old.length != New.length) {
        return false;
    }
    ;
    var lengthM = Old.length;
    for (var index = 0; index < lengthM; index++) {
        if (Old[index] != New[index]) {
            return false;
        }
        ;
    }
    return true;
}
/**
 * Функция окончания игры
 * @element Кнопка, на которую нажали
 *
 */
function endGame() {
    location.reload();
}
