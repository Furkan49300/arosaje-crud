import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './User.css';

const Authentification = () => {
    const [message, setMessage] = useState('');
    const [inscriptionData, setInscriptionData] = useState({
        nom: '',
        prenom: '',
        mail: '',
        password: '',
        role: 'USER', // Valeur par défaut
    });


    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const messageParam = queryParams.get('message');
        setMessage(messageParam);
    }, [location.search]);

    const [connexionData, setConnexionData] = useState({
        mail: '',
        password: '',
    });

    const [error, setError] = useState(null);

    const handleInscriptionChange = (e) => {
        const { name, value } = e.target;
        setInscriptionData({ ...inscriptionData, [name]: value });
    };

    const handleConnexionChange = (e) => {
        const { name, value } = e.target;
        setConnexionData({ ...connexionData, [name]: value });
    };



    const handleInscriptionSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: inscriptionData.nom,
                    prenom: inscriptionData.prenom,
                    mail: inscriptionData.mail,
                    password: inscriptionData.password,
                    role: inscriptionData.role,
                }),
            });

            if (response.ok) {
                try {
                    const loginResponse = await fetch('http://localhost:8080/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            mail: inscriptionData.mail,
                            password: inscriptionData.password,
                        }),
                    });
                    if (loginResponse.ok) {
                        const responseData = await loginResponse.json();
                        const { token, id_utilisateur } = responseData;
                        localStorage.setItem('token', token);
                        localStorage.setItem('id_utilisateur', id_utilisateur); // Stocker l'ID de l'utilisateur
                        window.location.href = '/show-plante';
                    } else {
                        setError('Erreur lors de la connexion. Veuillez vérifier vos identifiants.');
                    }
                } catch (error) {
                    console.error('Erreur lors de la connexion :', error);
                    setError('Erreur lors de la connexion. Veuillez réessayer plus tard.');
                }
            } else {
                setError('Erreur lors de l\'inscription.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription :', error);
            setError('Erreur lors de l\'inscription. Veuillez réessayer plus tard.');
        }
    };

    const handleConnexionSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mail: connexionData.mail,
                    password: connexionData.password,
                }),
            });
            if (response.ok) {
                const responseData = await response.json();
                const { token, id_utilisateur } = responseData;
                localStorage.setItem('token', token);
                localStorage.setItem('id_utilisateur', id_utilisateur); // Stocker l'ID de l'utilisateur
                window.location.href = '/show-plante';
            } else {
                setError('Erreur lors de la connexion. Veuillez vérifier vos identifiants.');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            setError('Erreur lors de la connexion. Veuillez réessayer plus tard.');
        }
    };



    return (
        <div className="auth-container">
            <form className="inscription-form" onSubmit={handleInscriptionSubmit}>
                <h2>Inscription</h2>
                <input type="text" name="nom" placeholder="Nom" value={inscriptionData.nom} onChange={handleInscriptionChange} />
                <input type="text" name="prenom" placeholder="Prénom" value={inscriptionData.prenom} onChange={handleInscriptionChange} />
                <input type="email" name="mail" placeholder="E-mail" value={inscriptionData.mail} onChange={handleInscriptionChange} />
                <input type="password" name="password" placeholder="Mot de passe" value={inscriptionData.password} onChange={handleInscriptionChange} />
                <label>
                    Utilisateur

                    <input className="checkbox-input" type="checkbox" name="role" value="USER" checked={inscriptionData.role === 'USER'} onChange={handleInscriptionChange} />
                </label>
                <label>
                    Botaniste
                    <input className="checkbox-input" type="checkbox" name="role" value="BOTANISTE" checked={inscriptionData.role === 'BOTANISTE'} onChange={handleInscriptionChange} />

                </label>
                <button className="mdr" type="submit">S'inscrire</button>
            </form>
            <form className="connexion-form" onSubmit={handleConnexionSubmit}>
                <h2>Connexion</h2>
                <input type="email" name="mail" placeholder="E-mail" value={connexionData.mail} onChange={handleConnexionChange} />
                <input type="password" name="password" placeholder="Mot de passe" value={connexionData.password} onChange={handleConnexionChange} />
                <button className="mdr" type="submit">Se connecter</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <div className="auth-container">
                {message && <div className="message"><h3>{message}</h3></div>}
            </div>
        </div>

    );
};

export default Authentification;
