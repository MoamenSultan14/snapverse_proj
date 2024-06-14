import { useContext , useState } from "react";
import "./createpost.css"
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import axios from "axios"
import { AuthContext } from "../../context/AuthContext";

function Createpost({ onClose }) {

    const {user} = useContext(AuthContext);
    const [desc, setDesc] = useState('');
    const [file,setFile] = useState(null)

    const handleInputChange = (event) => {
        setDesc(event.target.value);
    };

    const handleWrapperClick = (e) => {
        // Prevent the click event from propagating to the container
        e.stopPropagation();
    };

    const convertToBase64 = (e) =>{
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setFile(reader.result);
        };
        reader.onerror = err => {
            console.log(err)
        }
    }

    async function uploadImage() {

        await axios.post("/posts/", {
            userId: user._id,
            img: file,
            desc: desc
        });

        onClose();
        window.location.reload();
    }

    return (
        <div className="popupContaier" onClick={onClose}>
            <div className="popupWrapper" onClick={handleWrapperClick}>
                <div className="popupTop">
                    <span className="popupText">Create a post</span>
                </div>
                <div className="popupContent">
                    {!file && (
                        <>
                            <PhotoOutlinedIcon style={{ fontSize: "100px" }} />
                            <span className="contentText">Upload photos</span>
                            <label htmlFor="file" className="InputImg">
                                <span className="uploadImg">Select from computer</span>
                                <input style={{ display: "none" }} type="file" id="file" accept=".jpg,.jpeg,.png" onChange={convertToBase64} />
                            </label>
                        </>
                    )}
                    {file && (
                        <>
                            <img src={file} className="uploadedImg" />

                            <textarea 
                            placeholder="Add description to your post..."
                            className="addDesc"
                            value={desc}
                            onChange={handleInputChange}
                            />

                            <button className="submit" onClick={uploadImage}>Submit</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Createpost;

