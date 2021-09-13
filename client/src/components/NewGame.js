import { useState }  from 'react';
import { createGameInBackend } from '../MinesServer';
import { catchErrors } from '../utils';
const NewGameForm = (props) => {
    const [formValues, setFormValues] = useState({
        rows: 2,
        columns: 2,
        mines: 2
    });

    const handleChange = evt => {
        const updateFormValues = {
            ...formValues,
            [evt.target.id]: evt.target.value
        };

        setFormValues(updateFormValues);
    };

    const handleSubmit = evt => {
        evt.preventDefault();
        if (formValues.mines > (formValues.columns * formValues.rows ) -1) {
            alert(`You have selected too many mines (${formValues.mines}) for a board of ${formValues.rows} X ${formValues.columns} cells`);
        } else {
            createInBackend();
            props.onGameListChange(); 
            alert("Game created!!");
        }

    }

    const createInBackend = () => {
        let newGameData = {
            useremail: props.userEmail,
            rows: formValues.rows,
            columns: formValues.columns,
            mines: formValues.mines
        };
        const createGame = async () => {
            const createdGame = await createGameInBackend(newGameData);
            console.log('----------------')
            console.log(createdGame);
        }

        catchErrors(createGame())
    }

    return (<>
        <p>Customize your next match!</p>
        <form onSubmit={handleSubmit}>
            <label htmlFor='rows'>Rows</label>
            <select id='rows' value= {formValues['rows']} onChange={handleChange}>

                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
            </select>
            <label htmlFor='columns'>Columns</label>
            <select id='columns' value= {formValues['columns']} onChange={handleChange}>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
            </select>
            <label htmlFor='mines'>Mines</label>
            <select id='mines' value= {formValues['mines']} onChange={handleChange}>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
            </select>
            <button>Create new game</button>
        </form>
    </>);
};

export default NewGameForm;