import React, { useEffect, useMemo, useState } from 'react'
import './MainProfile.css'
import MainNav from './../../Nav'
//material ui
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GET_PROFILE, PROFILE_MUTATION } from '../../../../graphql/index';
import { useQuery, useMutation } from 'react-apollo'
import { faAdjust } from '@fortawesome/free-solid-svg-icons'



const MainProfile = () => {
    const [account, SetAcc] = useState(localStorage.getItem("account"))
    const [password, SetPass] = useState('')
    const [email, setEMail] = useState('')
    const [name, SetName] = useState('')
    const [picture, SetPic] = useState('')
    const [age, SetAge] = useState('')
    const [phone, SetPhone] = useState('')
    const [address, SetAddress] = useState('')
    const [introduction, SetIntro] = useState('')
    const { loading, error, data } = useQuery(GET_PROFILE, { variables: { account: account }, })
    const [editp] = useMutation(PROFILE_MUTATION)
    const cachedMutatedData = useMemo(() => {
        if (loading || error) return null
        SetAcc(data.getProfile? data.getProfile.account: '')
        SetPass(data.getProfile? data.getProfile.password: '')
        setEMail(data.getProfile? data.getProfile.email: '')
        SetName(data.getProfile? data.getProfile.name: '')
        SetPic(data.getProfile? data.getProfile.picture: '')
        SetAge(data.getProfile? data.getProfile.age: '')
        SetPhone(data.getProfile? data.getProfile.phone: '')
        SetAddress(data.getProfile? data.getProfile.address: '')
        SetIntro(data.getProfile? data.getProfile.introduction: '')
        return data
    }, [loading, error, data])


    function setTheme(themeName) {
        localStorage.setItem('theme', themeName);
        document.getElementById("theme-controller").className = themeName;
    }
    // function to toggle between light and dark theme
    function toggleTheme() {
        if (localStorage.getItem('theme') === 'theme-dark') {
            setTheme('theme-light');
        } else {
            setTheme('theme-dark');
        }
    }

    useEffect(
        // Immediately invoked function to set the theme on initial load
        () => {
            if (localStorage.getItem('theme') === 'theme-dark') {
                setTheme('theme-dark');
            } else {
                setTheme('theme-light');
            }
        }
    );

    const changecover = (e) => {
        e.preventDefault();
        console.log(e.target.value)
        const urlsrc = URL.createObjectURL(e.target.files?.item(0))
        var image = new Image();
        image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = 230; 
        canvas.height = 230; 
        canvas.getContext('2d').drawImage(this, 0, 0, 230, 230);
        SetPic(canvas.toDataURL('image/png'));
            editp({
                variables: {
                    account: account,
                    picture: canvas.toDataURL('image/png')
                }
            })
        };
        image.src = urlsrc;
    }

    useEffect(() => {

    })
    return (
        <>
            <div className="theme-dark" id='theme-controller'>
                {<MainNav className="nav" />}
                <div className="main-div-profile">
                    <div className="profile_img">
                        <img className="profile_pic" src={picture?(picture):("https://ern-dubai.com/wp-content/uploads/2019/04/facebook-anonymous-app.jpg")}></img>
                        <input accept="image/*" className='input' id="icon-button-file" type="file" onChange={changecover}/>
                        <label htmlFor="icon-button-file">
                            <IconButton color="primary" aria-label="upload picture" component="span" className="change_photo">
                                <PhotoCamera />
                            </IconButton>
                        </label>

                        <button id="themeswitch" onClick={toggleTheme}><FontAwesomeIcon icon={faAdjust} /></button>

                    </div>
                    <div className="profile">

                        <div style={{ width: "100%" }}>
                            <p style={{ float: "left", width: '120px', fontSize: "15px" }}>account:</p>
                            <p style={{ float: "left", width: "200px", fontSize: "15px" }}>{account}

                            </p>
                        </div>

                        <div style={{ float: "left", width: "100%" }}>
                            <p style={{ float: "left", width: '120px', fontSize: "15px" }}>name:</p>
                            {name ?
                                (<>
                                    <p style={{ float: "left", width: "200px", fontSize: "15px" }}>{name}</p>
                                    <Button id="button" onClick={() => {
                                        SetName('')
                                    }}>reset</Button>
                                </>)
                                : (<>
                                    <input id='name' className='name' style={{ float: "left", width: "200px" }}></input>
                                    <label htmlFor='name'>
                                        <Button id="button" onClick={(e) => {
                                            editp({
                                                variables: {
                                                    account: account,
                                                    name: document.getElementById("name").value
                                                }
                                            })

                                            SetName(document.getElementById("name").value)
                                        }}>enter</Button>
                                    </label>
                                </>)
                            }
                        </div>


                        <div style={{ float: "left", width: "100%" }}>
                            <p style={{ float: "left", width: '120px', fontSize: "15px" }}>phone:</p>
                            {phone ?
                                (<>
                                    <p style={{ float: "left", width: "200px", fontSize: "15px" }}>{phone}</p>
                                    <Button id="button" onClick={() => { SetPhone('') }}>reset</Button>
                                </>)
                                : (<>
                                    <input id='phone' style={{ float: "left", width: "200px" }}></input>
                                    <Button id="button" onClick={(e) => {
                                        editp({
                                            variables: {
                                                account: account,
                                                phone: document.getElementById("phone").value
                                            }
                                        })
                                        SetPhone(document.getElementById("phone").value)
                                    }}>enter</Button>
                                </>)
                            }
                        </div>

                        <div style={{ float: "left", width: "100%" }}>
                            <p style={{ float: "left", width: '120px', fontSize: "15px" }}>address:</p>
                            {address ?
                                (<>
                                    <p style={{ float: "left", width: "200px", fontSize: "15px" }}>{address}</p>
                                    <Button id="button" onClick={() => { SetAddress('') }}>reset</Button>
                                </>)
                                : (<>
                                    <input id='address' style={{ float: "left", width: "200px" }}></input>
                                    <Button id="button" onClick={(e) => {
                                        editp({
                                            variables: {
                                                account: account,
                                                address: document.getElementById("address").value
                                            }
                                        })
                                        SetAddress(document.getElementById("address").value)
                                    }}>enter</Button>
                                </>)
                            }
                        </div>
                        <div style={{ float: "left", width: "100%" }}>
                            <p style={{ float: "left", width: '120px', fontSize: "15px" }}>email:</p>
                            {email ?
                                (<>
                                    <p style={{ float: "left", width: "200px", fontSize: "15px" }}>{email}</p>
                                    <Button id="button" onClick={() => { setEMail('') }}>reset</Button>
                                </>)
                                : (<>
                                    <input id='email' style={{ float: "left", width: "200px" }}></input>
                                    <Button id="button" onClick={(e) => {
                                        editp({
                                            variables: {
                                                account: account,
                                                email: document.getElementById("email").value
                                            }
                                        })
                                        setEMail(document.getElementById("email").value)
                                    }}>enter</Button>
                                </>)
                            }
                        </div>

                        <div style={{ float: "left", width: "100%" }}>
                            <p style={{ float: "left", width: '120px', fontSize: "15px" }}>password:</p>
                            {password ?
                                (<>
                                    <p style={{ float: "left", width: "200px", fontSize: "15px" }}>{password}</p>
                                    <Button id="button" onClick={() => { SetPass('') }}>reset</Button>
                                </>)
                                : (<>
                                    <input id='password' style={{ float: "left", width: "200px" }}></input>
                                    <Button id="button" onClick={(e) => {
                                        editp({
                                            variables: {
                                                account: account,
                                                password: document.getElementById("password").value
                                            }
                                        })
                                        SetPass(document.getElementById("password").value)
                                    }}>enter</Button>
                                </>)
                            }
                        </div>

                        <div style={{ float: "left", width: "100%" }}>
                            <p style={{ float: "left", width: '120px', fontSize: "15px" }}>age:</p>
                            {age ?
                                (<>
                                    <p style={{ float: "left", width: "200px", fontSize: "15px" }}>{age}</p>
                                    <Button id="button" onClick={() => { SetAge('') }}>reset</Button>
                                </>)
                                : (<>
                                    <input id='age' style={{ float: "left", width: "200px" }}></input>
                                    <Button id="button" onClick={(e) => {
                                        editp({
                                            variables: {
                                                account: account,
                                                age: parseInt(document.getElementById("age").value)
                                            }
                                        })
                                        SetAge(document.getElementById("age").value)
                                    }}>enter</Button>
                                </>)
                            }
                        </div>

                        <div style={{ float: "left", width: "100%" }}>
                            <p style={{ float: "left", width: '120px', fontSize: "15px" }}>introduction:</p>
                            {introduction ?
                                (<>
                                    <p style={{ float: "left", width: "200px", fontSize: "15px" }}>{introduction}</p>
                                    <Button id="button" onClick={() => { SetIntro('') }}>reset</Button>
                                </>)
                                : (<>
                                    <input id='introduction' style={{ float: "left", width: "200px" }}></input>
                                    <Button id="button" onClick={(e) => {
                                        editp({
                                            variables: {
                                                account: account,
                                                introduction: document.getElementById("introduction").value
                                            }
                                        })
                                        SetIntro(document.getElementById("introduction").value)
                                    }}>enter</Button>
                                </>)
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default MainProfile;