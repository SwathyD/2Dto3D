<h1>Augmented Product Preview System for E-commerce Sites</h1>
The proposed system majorly consists of three sections: Generating local image database, 3D reconstruction and augmented product preview. 
3D reconstruction phase consists of enhancing the image (removing noise, adjusting contrast, equalising, etc), followed by identifying world coordinates of various keypoints from the images using techniques such as deep learning and SIFT. Finally creating a 3D model by mapping the keypoints together and persisting it in a database. Finally the augmented product preview module takes the 3D model as an input, finds the intrinsic and extrinsic parameters through camera calibration, performs localization & mapping (via Surface Detection, Image Segmentation, or SLAM techniques) and then renders the output frames onto the customers mobile device.

![image](https://github.com/user-attachments/assets/34693658-0d36-48de-ac0d-7e0492ade02e)
