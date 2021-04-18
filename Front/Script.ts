
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

    let MainBlockOfTheGame : HTMLElement | HTMLDivElement = document.getElementById('MainBlock');
    const FileInput: HTMLElement | HTMLInputElement = document.getElementById('NewImage');
    const PlayButton: HTMLElement | HTMLButtonElement = document.getElementById('Play');
    const ReloadButton: HTMLElement | HTMLButtonElement = document.getElementById('Reload');
    const SurrenderButton: HTMLElement | HTMLButtonElement = document.getElementById('Surrender');
    const CurrentDifficulty: HTMLElement | HTMLSelectElement = document.getElementById('SelectAmount');
    const Next: HTMLElement | HTMLButtonElement = document.getElementById('NextButton');
    const settings: HTMLElement | HTMLDivElement = document.getElementById('settings');

    const PlayAgain: HTMLElement | HTMLButtonElement = document.getElementById('PlayAgain');
    const ResultH1: HTMLElement | HTMLHeadElement = document.getElementById('Result');
    const Again: HTMLElement | HTMLDivElement = document.getElementById('Again');

    let StartMassivOfElements: Array<HTMLDivElement> = [];
    let RandomMassivOfElements: Array<HTMLDivElement> = [];
    let IsFirstClick: boolean = true;
    let PrevElement: HTMLDivElement;

/* EventListeners */

    FileInput.addEventListener('change' , (ev) => {

        StartMassivOfElements.length = 0; /* Обнуление массива на случай, если пользователь начнёт заново */

        let File: Blob = FileInput.files[0]; /* Считывание файла пользователя */
        let Reader: FileReader = new FileReader();
        Reader.readAsDataURL(File);
        Reader.onload = () => { /* Действия при успешном считывании */
            const AmountItems = Number(CurrentDifficulty.value); /* Получение текущей сложности */
            const CurrentStyles = GetCurrentStyles(AmountItems); /* Получени стилей в зависимости от сложности */
            StartMassivOfElements = GenerateNewImage(AmountItems, CurrentStyles, Reader.result); /* Генерация нового массива */
            RenderBlocks(StartMassivOfElements); /* Отрисовка массива */
            /* Изменение стилей различных элементов */
            FileInput.classList.add('invisible');
            ReloadButton.classList.remove('invisible');
            MainBlockOfTheGame.classList.remove('invisible');
            settings.style.left = `75%`;
        }
    });

    ReloadButton.addEventListener('click', () => {
        let CurrentLength = StartMassivOfElements.length;
        RandomMassivOfElements.length = 0;

        for (let index = 0; index < CurrentLength; index++) {
            let flag = false;
            while(flag == false){
                let Random = RandomNumber(0, CurrentLength - 1);
                let RandomDiv: HTMLDivElement = document.getElementById(`i${Random}`);

                if (RandomMassivOfElements.indexOf(RandomDiv) !== -1) {
                    /* Элемент уже есть в массиве */
                } else {
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

    PlayButton.addEventListener('click', () => {
        AddListen(MainBlockOfTheGame);
        ReloadButton.classList.add('invisible');
        PlayButton.classList.add('invisible');
        SurrenderButton.classList.remove('invisible');
        CurrentDifficulty.classList.add('invisible');
    });

    Next.addEventListener('click', () => {
        if (!CurrentDifficulty.classList.contains('invisible')) {
            CurrentDifficulty.classList.add('invisible');
            FileInput.classList.remove('invisible');
            Next.classList.add('invisible');
        }
    });

    SurrenderButton.addEventListener('click', () => {
        endGame();
    });

    PlayAgain.addEventListener('click', () => {
        endGame();
    })
/* Конец EventListeners */

/* Методы */

    /**
     * Генерация новых блоков при загрузке новой картинки.
     * @AmountItems {number} Кол - во генерируемых блоков.
     * @ElementsStyles {number} Ширина и высота каждого элемента в пикселях.
     * @BackImage {string} Картинка пользователя.
     * @returns Возвращает массив с элементами.
     */

    function GenerateNewImage(AmountItems: number, ElementsStyles: number, BackImage: string | ArrayBuffer): Array<HTMLDivElement>{
        let ResultMassiv: Array<HTMLDivElement> = []; /* Объявление массива */

        for (let index = 0; index < AmountItems; index++) { /* Перебор каждого элемента */
            const DivElement: HTMLDivElement = document.createElement('div'); /* Создание нового элемента */
            DivElement.className = 'PieceOfImage absolute'; /* Добавление классов элементу */
            DivElement.style.width = DivElement.style.height = `${ElementsStyles}px`; /* Позиционирование элемента */
            DivElement.style.backgroundImage = `url(${BackImage})`; /* Ставим картинку пользовтаеля на зданий фон */
            DivElement.id = `i${index}`; /* Присваиваем блоку ID */
            
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

    function GetCurrentStyles(AmountItems: number): number{
        if (AmountItems == 9) { return 200 }
        if (AmountItems == 16) { return 150 }
        return 120;
    }

    /**
     * Функция отрисовки блоков внутри MainBlock
     * 
     * @Massiv Входящий массив элементов.
     */

    function RenderBlocks(Massiv: Array<HTMLDivElement>): void{

        let CountElements = Massiv.length;
        let WidhtAndHeight = getWidthOfElement(Massiv[0]);
        let CountInRow = Math.sqrt(CountElements);
        let i = 0;
        
        Massiv.forEach( (DIV) => {
            i++;
            /* Положение элемента в зависимтости от его очереди в массиве */
            let Id = getIDofElement(DIV) + 1;

            let CurrentRow = Math.ceil(i / CountInRow);
            let CurrentColumn = getColumn(i, CountInRow, CurrentRow);
            let CurrentX = (CurrentColumn - 1) * WidhtAndHeight;
            let CurrentY = (CurrentRow - 1) * WidhtAndHeight;
            DIV.style.left = `${CurrentX}px`;
            DIV.style.top = `${CurrentY}px`;
            /* Задний фон блока в зависимости от его ID */
            let CurrentRowForBack = Math.ceil(Id / CountInRow);
            let CurrentColumnForBack = getColumn(Id, CountInRow, CurrentRowForBack);
            let CurrentXForBack = (CurrentColumnForBack - 1) * WidhtAndHeight;
            let CurrentYForBack = (CurrentRowForBack - 1) * WidhtAndHeight;
            DIV.style.backgroundPosition = `left -${CurrentXForBack}px top -${CurrentYForBack}px`;
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

    function getColumn(id: number, CountInRow: number, CurrentRow: number): number {
        if (id % CountInRow === 0) { return CountInRow };
        if (id === 1) { return 1 }; 
        return id - ((CurrentRow - 1) * CountInRow);
    }

    /**
     * Получние ID Div - эелемента (Частички паззла).
     * 
     * @Element Div - элемент.
     * @returns Id в числовом формате.
     */

    function getIDofElement(Element : HTMLDivElement): number{
        let IdToArray = Element.id.split('');
        IdToArray[0] = '';
        let Result = Number(IdToArray.join(''));
        return Result;
    }

    /**
     * Получение Width элемента в числовом формате.
     * 
     * @Element DOM - элемент.
     */

    function getWidthOfElement(Element: HTMLElement): number {
        let WidthArray = Element.style.width.split('');
        WidthArray.length = WidthArray.length - 2;
        let Result = Number(WidthArray.join(''));
        return Result;
    }

    /**
     *  Функция для получения случайного числа от min до max.
     */

    function RandomNumber(min:number, max:number): number{
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Функция, добвляющая EventListener на элемент.
     * 
     * @DIV Элемент, который мы прослушиваем.
     */

    function AddListen(DIV: HTMLDivElement | HTMLElement): void{
        DIV.addEventListener('click', (evnt) => {
            ChangePlace(evnt);
        })
    }

    /**
     * Функция смены позиций у элементов "Паззла".
     * 
     * @Evnt Событие на главном блоке.
     */

    function ChangePlace(Evnt: MouseEvent): void{
        if (IsFirstClick) {
            PrevElement = Evnt.path[0];
            IsFirstClick = !IsFirstClick;
        } else{
            let CurrentItem: HTMLDivElement = Evnt.path[0];
            let CurrentX = CurrentItem.style.left;
            let CurrentY = CurrentItem.style.top;

            CurrentItem.style.left = PrevElement.style.left;
            CurrentItem.style.top = PrevElement.style.top;

            PrevElement.style.left = CurrentX;
            PrevElement.style.top = CurrentY;

            const LengthC = RandomMassivOfElements.length;
            let oldId, newId;

            for (let index = 0; index < LengthC; index++) {
                if (PrevElement.id === RandomMassivOfElements[index].id) {oldId = index; break}                
            }

            for (let j = 0; LengthC; j++) {
                if (CurrentItem.id === RandomMassivOfElements[j].id) {newId = j; break}                
            }

            RandomMassivOfElements[oldId] = CurrentItem;
            RandomMassivOfElements[newId] = PrevElement;

            let Result = CheckMassivs(RandomMassivOfElements, StartMassivOfElements);
            if(Result) {
                MainBlockOfTheGame.innerHTML = '';
                let Clone = MainBlockOfTheGame.cloneNode(true);
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

     function CheckMassivs(Old: Array<HTMLDivElement>, New: Array<HTMLDivElement>): boolean{
        if (Old.length != New.length) {return false};

        let lengthM = Old.length;

        for (let index = 0; index < lengthM; index++) {
            if (Old[index] != New[index]) {return false};            
        }

        return true;
     }

     /**
      * Функция окончания игры
      * @element Кнопка, на которую нажали
      * 
      */

     function endGame(): void{
        location.reload();
     }