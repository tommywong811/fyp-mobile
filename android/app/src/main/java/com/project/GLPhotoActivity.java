package com.project;

import android.app.Activity;
import android.app.FragmentManager;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;

import com.project.glview.GLPhotoView;
import com.project.model.Photo;
import com.project.model.RotateInertia;
import com.project.network.HttpConnector;
import com.project.network.HttpDownloadListener;
import com.project.network.ImageData;
import com.project.view.ConfigurationDialog;
import com.project.view.LogView;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;


/**
 * Activity that displays photo object as a sphere
 */
public class GLPhotoActivity extends Activity implements ConfigurationDialog.DialogBtnListener {

    private static final String CAMERA_IP_ADDRESS = "CAMERA_IP_ADDRESS";
    private static final String OBJECT_ID = "OBJECT_ID";
    private static final String THUMBNAIL = "THUMBNAIL";

    private GLPhotoView mGLPhotoView;

    private Photo mTexture = null;
    private LoadPhotoTask mLoadPhotoTask = null;

    private RotateInertia mRotateInertia = RotateInertia.INERTIA_0;
    private String roomName;
    private Button saveButton;

    public static final int REQUEST_REFRESH_LIST = 100;
    public static final int REQUEST_NOT_REFRESH_LIST = 101;

    /**
     * onCreate Method
     * @param savedInstanceState onCreate Status value
     */
    @Override
    protected void onCreate(final Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_glphoto);

        Intent intent = getIntent();
        String cameraIpAddress = intent.getStringExtra(CAMERA_IP_ADDRESS);
        String fileId = intent.getStringExtra(OBJECT_ID);
        byte[] byteThumbnail = intent.getByteArrayExtra(THUMBNAIL);
        roomName = intent.getStringExtra("roomName");

        ByteArrayInputStream inputStreamThumbnail = new ByteArrayInputStream(byteThumbnail);
        Drawable thumbnail = BitmapDrawable.createFromStream(inputStreamThumbnail, null);

        Photo _thumbnail = new Photo(((BitmapDrawable)thumbnail).getBitmap());

        mGLPhotoView = (GLPhotoView) findViewById(R.id.photo_image);
        mGLPhotoView.setTexture(_thumbnail);
        mGLPhotoView.setmRotateInertia(mRotateInertia);
        saveButton = (Button) findViewById(R.id.saveButton);
        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String root = Environment.getExternalStorageDirectory().toString();
                File myDir = new File(root + "/saved_images/" + roomName);
                myDir.mkdirs();

                String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
                String fname = "Panorama_"+ timeStamp +".jpg";

                File file = new File(myDir, fname);
                if (file.exists()) file.delete ();
                try {
                    FileOutputStream out = new FileOutputStream(file);
                    mTexture.getPhoto().compress(Bitmap.CompressFormat.JPEG, 100, out);
                    out.flush();
                    out.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        mLoadPhotoTask = new LoadPhotoTask(cameraIpAddress, fileId);
        mLoadPhotoTask.execute();
    }

    @Override
    protected void onDestroy() {
        if (mTexture != null) {
            mTexture.getPhoto().recycle();
        }
        if (mLoadPhotoTask != null) {
            mLoadPhotoTask.cancel(true);
        }
        super.onDestroy();
    }

    /**
     * onCreateOptionsMenu method
     * @param menu Menu initialization object
     * @return Menu display feasibility status value
     */
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.configuration, menu);

        return true;
    }


    /**
     * onOptionsItemSelected Method
     * @param item Process menu
     * @return Menu process continuation feasibility value
     */
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        super.onOptionsItemSelected(item);
        switch (item.getItemId()) {
            case R.id.configuration:
                FragmentManager mgr = getFragmentManager();
                ConfigurationDialog.show(mgr, mRotateInertia);
                break;
            default:
                break;
        }
        return true;
    }


    /**
     * onResume Method
     */
    @Override
    protected void onResume() {
        super.onResume();
        mGLPhotoView.onResume();

        if (null != mTexture) {
            if (null != mGLPhotoView) {
                mGLPhotoView.setTexture(mTexture);
            }
        }
    }

    /**
     * onPause Method
     */
    @Override
    protected void onPause() {
        this.mGLPhotoView.onPause();
        super.onPause();
    }


    /**
     * onDialogCommitClick Method
     * @param inertia selected inertia
     */
    @Override
    public void onDialogCommitClick(RotateInertia inertia) {
        mRotateInertia = inertia;
        if (null != mGLPhotoView) {
            mGLPhotoView.setmRotateInertia(mRotateInertia);
        }
    }


    private class LoadPhotoTask extends AsyncTask<Void, Object, ImageData> {

        private LogView logViewer;
        private ProgressBar progressBar;
        private String cameraIpAddress;
        private String fileId;
        private long fileSize;
        private long receivedDataSize = 0;
        private Button saveButton;

        public LoadPhotoTask(String cameraIpAddress, String fileId) {
            this.logViewer = (LogView) findViewById(R.id.photo_info);
            this.progressBar = (ProgressBar) findViewById(R.id.loading_photo_progress_bar);
            this.cameraIpAddress = cameraIpAddress;
            this.fileId = fileId;
            this.saveButton = (Button) findViewById(R.id.saveButton);
        }

        @Override
        protected void onPreExecute() {
            progressBar.setVisibility(View.VISIBLE);
            saveButton.setEnabled(false);
        }

        @Override
        protected ImageData doInBackground(Void... params) {
            try {
                publishProgress("start to download image" + fileId);
                HttpConnector camera = new HttpConnector(cameraIpAddress);
                ImageData resizedImageData = camera.getImage(fileId, new HttpDownloadListener() {
                    @Override
                    public void onTotalSize(long totalSize) {
                        fileSize = totalSize;
                    }

                    @Override
                    public void onDataReceived(int size) {
                        receivedDataSize += size;

                        if (fileSize != 0) {
                            int progressPercentage = (int) (receivedDataSize * 100 / fileSize);
                            publishProgress(progressPercentage);
                        }
                    }
                });
                publishProgress("finish to download");
                return resizedImageData;

            } catch (Throwable throwable) {
                String errorLog = Log.getStackTraceString(throwable);
                publishProgress(errorLog);
                return null;
            }
        }

        @Override
        protected void onProgressUpdate(Object... values) {
            for (Object param : values) {
                if (param instanceof Integer) {
                    progressBar.setProgress((Integer) param);
                } else if (param instanceof String) {
                    logViewer.append((String) param);
                }
            }
        }

        @Override
        protected void onPostExecute(ImageData imageData) {
            if (imageData != null) {

                byte[] dataObject = imageData.getRawData();

                if (dataObject == null) {
                    logViewer.append("failed to download image");
                    return;
                }

                Bitmap __bitmap = BitmapFactory.decodeByteArray(dataObject, 0, dataObject.length);

                progressBar.setVisibility(View.GONE);

                Double yaw = imageData.getYaw();
                Double pitch = imageData.getPitch();
                Double roll = imageData.getRoll();
                logViewer.append("<Angle: yaw=" + yaw + ", pitch=" + pitch + ", roll=" + roll + ">");

                mTexture = new Photo(__bitmap, yaw, pitch, roll);
                if (null != mGLPhotoView) {
                    mGLPhotoView.setTexture(mTexture);
                }
                saveButton.setEnabled(true);
            } else {
                logViewer.append("failed to download image");
            }
        }
    }

    /**
     * Activity call method
     * 
     * @param activity Call source activity
     * @param cameraIpAddress IP address for camera device
     * @param fileId Photo object identifier
     * @param thumbnail Thumbnail
     * @param refreshAfterClose true is to refresh list after closing this activity, otherwise is not to refresh
     */
    public static void startActivityForResult(Activity activity, String cameraIpAddress, String fileId, byte[] thumbnail, boolean refreshAfterClose, String roomName) {
        int requestCode;
        if (refreshAfterClose) {
            requestCode = REQUEST_REFRESH_LIST;
        } else {
            requestCode = REQUEST_NOT_REFRESH_LIST;
        }

        Intent intent = new Intent(activity, GLPhotoActivity.class);
        intent.putExtra(CAMERA_IP_ADDRESS, cameraIpAddress);
        intent.putExtra(OBJECT_ID, fileId);
        intent.putExtra(THUMBNAIL, thumbnail);
        intent.putExtra("roomName", roomName);
        activity.startActivityForResult(intent, requestCode);
    }
}