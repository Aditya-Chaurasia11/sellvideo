import React, { useRef, useEffect, useState } from "react";
import "./videoPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useWeb3 } from "../api/contextapi";
import { ethers } from "ethers";

const VideoPage = () => {
  const { account, setAccount, provider, setProvider, contract, setContract } =
    useWeb3();
  const videoRef = useRef(null);
  const [alertShown, setAlertShown] = useState(false);
  const { tid } = useParams();
  const [prodList, setProdList] = useState({});
  const [url, setUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [buyPrice, setBuyPrice] = useState("");

  const parseDataToArray = (data) => {
    const elements = data.split(",");
    return {
      tokenId: elements[0],
      owner: elements[1],
      sender: elements[2],
      price: elements[3],
      outForSale: elements[4] === "true",
      videoURL: elements[5],
      videoName: elements[6],
      videoDescription: elements[7],
      videoCategory: elements[8],
    };
  };

  const getVideoDetail = async () => {
    try {
      const array = await contract?.getNFTDetails(tid);
      if (array) {
        const arrayToString = array.toString();
        const readableArray = parseDataToArray(arrayToString);
        setProdList(readableArray);
        setUrl(readableArray.videoURL);
      }
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  };

  const stopsaleHandle = async () => {
    try {
      if (account === prodList.sender) {
        const stopSale = await contract.stopsale(tid);
        console.log(stopSale);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePriceChange = async () => {};

  const handleBuyVideo = async () => {
    try {
      if (account !== prodList.sender) {
        const buyVideo = await contract.buynft(tid, {
          value: prodList.price,
        });
        console.log(buyVideo);
      } else if (prodList.outForSale === false) {
        // console.log("asdadad");
        const resaleVideo = await contract.resale(tid);
        console.log(resaleVideo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (contract && tid) {
      getVideoDetail();
    }
  }, [tid]);

  useEffect(() => {
    try {
      const videoElement = videoRef.current;

      if (videoElement) {
        const handleLoadedMetadata = () => {
          setVideoDuration(videoElement.duration);
        };

        const handleTimeUpdate = () => {
          const maxTime = 3;
          if (videoElement.currentTime >= maxTime) {
            videoElement.pause();
            videoElement.currentTime = maxTime;
            videoElement.controls = false;
            if (!alertShown) {
              toast.info("Buy the video to view more!", {
                position: "bottom-right",
                theme: "dark",
              });
              setAlertShown(true);
            }
          }
        };

        if (account !== prodList.sender) {
          videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
          videoElement.addEventListener("timeupdate", handleTimeUpdate);
        }

        return () => {
          videoElement.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        };
      }
    } catch (error) {
      console.log(error);
    }
  }, [alertShown, url]);

  return (
    <div className="videopage_container">
      <ToastContainer />
      <div className="videopage_left">
        {url ? (
          <video ref={videoRef} width="100%" controls controlsList="nodownload">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          "Loading..."
        )}
      </div>
      <div className="videopage_right">
        <div className="videopage_right_upper">
          <div className="videopage_right_upper_title">
            <h2>{prodList.videoName}</h2>
            <button
              onClick={stopsaleHandle}
              disabled={
                account !== prodList.sender || prodList.outForSale === false
              }
            >
              Stop sale
            </button>
          </div>
          <p>
            Owned by{" "}
            <span>
              {prodList.sender
                ? `${prodList.sender.slice(0, 6)}...${prodList.sender.slice(
                    -4
                  )}`
                : "NA"}
            </span>
          </p>
        </div>
        <div className="videopage_right_middle">
          {prodList.videoDescription}
        </div>
        <div className="videopage_right_lower">
          <div className="videopage_right_lower_price">
            <p>Current price</p>
            <h2>
              {prodList.price ? ethers.formatEther(prodList.price) : "0"} ETH
            </h2>
          </div>
          <div>
            {/* <button
              className="videopage_button_container2"
              onClick={handlePriceChange}
              disabled={
                account !== prodList.sender || prodList.outForSale === false
              }
            >
              Change price
            </button> */}
            <button
              className="videopage_button_container"
              onClick={handleBuyVideo}
            >
              {account !== prodList.sender
                ? "Buy now"
                : prodList.outForSale === true
                ? "Owned"
                : "Resale"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
