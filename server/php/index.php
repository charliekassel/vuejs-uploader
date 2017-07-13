<?php
/**
 * Example PHP upload
 *
 * Start built in php server using below command
 * php -S localhost:5000
 */

$uploader = new Uploader();
$uploader->saveUploadedFile();


class Uploader
{
    const UPLOAD_DIR = '../uploads/';

    /**
     * Uploader constructor
     */
    public function __construct()
    {
        $this->allowCors();
    }

    /**
     * Opens up CORS access
     */
    private function allowCors()
    {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit(0);
        }
    }

    /**
     * Saves the uploaded file
     *
     * @return [type] [description]
     */
    public function saveUploadedFile()
    {
        $this->handleUploadError($_FILES['file']['error']);

        if (move_uploaded_file($this->getSource(), $this->getTarget())) {
            if ($this->isMultipartUpload()) {
                $this->mergeMultiUpload(self::UPLOAD_DIR . $_POST['filename'], (int)$_POST['totalParts']);
            }
            return $this->response(200, [
                'message' => $this->getSuccessMessage(),
                // 'remainingParts' => []
            ]);
        }

        return $this->response(500, ['error' => 'Unknown Error']);
    }

    /**
     * Format a success message
     *
     * @return string
     */
    private function getSuccessMessage()
    {
        if ($this->isMultipartUpload()) {
            return sprintf('file %s part %s uploaded.', $_POST['filename'], $_POST['currentPart']);
        }

        return sprintf('file %s uploaded.', $_FILES['file']['name']);
    }

    /**
     * Get upload source
     *
     * @return string
     */
    private function getSource()
    {
        return $_FILES['file']['tmp_name'];
    }

    /**
     * Get target destination
     *
     * @return string
     */
    private function getTarget()
    {
        if ($this->isMultipartUpload()) {
            return self::UPLOAD_DIR . $_POST['filename'] . '.' . $_POST['currentPart'];
        }

        return self::UPLOAD_DIR . $_FILES['file']['name'];
    }

    /**
     * Is this a multipart upload?
     *
     * @return boolean
     */
    private function isMultipartUpload()
    {
        return !empty($_POST['multipart']);
    }

    /**
     * Formats an error response
     *
     * @param  int $uploadError
     */
    private function handleUploadError(int $uploadError)
    {
        if ($uploadError === 0) {
            return;
        }

        switch ($uploadError) {
            case 1:
                $error = 'UPLOAD_ERR_INI_SIZE';
                $message = 'The uploaded file exceeds the upload_max_filesize directive in php.ini.';
                break;
            case 2:
                $error = 'UPLOAD_ERR_FORM_SIZE';
                $message = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form.';
                break;
            case 3:
                $error = 'UPLOAD_ERR_PARTIAL';
                $message = 'The uploaded file was only partially uploaded.';
                break;
            case 4:
                $error = 'UPLOAD_ERR_NO_FILE';
                $message = 'No file was uploaded.';
                break;
            case 6:
                $error = 'UPLOAD_ERR_NO_TMP_DIR';
                $message = 'Missing a temporary folder.';
                break;
            case 7:
                $error = 'UPLOAD_ERR_CANT_WRITE';
                $message = 'Failed to write file to disk.';
                break;
            case 8:
                $error = 'UPLOAD_ERR_EXTENSION';
                $message = 'A PHP extension stopped the file upload';
        }

        $this->response(422, [
            'error' => $error,
            'message' => $message
        ]);
    }


    /**
     * Combines the parts of a multipart upload into a single file.
     *
     * @param  string $filename
     * @param  int    $totalParts
     */
    private function mergeMultiUpload(string $filename, int $totalParts) {
        $files = glob($filename . ".*");

        if (count($files) !== $totalParts) {
            return false;
        }

        ini_set('max_execution_time', 300);

        $out = fopen($filename, "w");
        foreach ($files as $file) {
            $in = fopen($file, "r");
            while ($line = fgets($in)) {
                fwrite($out, $line);
            }
            fclose($in);
        }
        fclose($out);

        foreach($files as $file) {
            unlink($file);
        }
    }

    /**
     * Sets json output response
     *
     * @param  int    $status
     * @param  array  $data
     */
    private function response(int $status, array $data) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit(0);
    }


}

