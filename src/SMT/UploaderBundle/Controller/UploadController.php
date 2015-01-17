<?php
namespace SMT\UploaderBundle\Controller;

use SMT\UploaderBundle\Entity\Image;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class UploadController
 * @package SMT\UploaderBundle\Controller
 * @Route(path="/upload")
 */
class UploadController extends Controller
{
    /**
     * @Route(path="/start", name="smt.uploader_start")
     */
    public function uploadAction(Request $request)
    {
        try {
            $image = new Image();
            $file = $request->files->get("file");
            $image->setImageFile($file);

            $this->getDoctrine()->getManager()->persist($image);
            $this->getDoctrine()->getManager()->flush();

            $deleteUrl = $this->generateUrl("smt.uploader_delete", ["id" => $image->getId()], true);
            return new JsonResponse([
                "success" => true,
                "id" => $image->getId(),
                "delete_url" => $deleteUrl
            ]);
        } catch(\Exception $e) {
            return new JsonResponse([
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * @Route(path="/{id}/delete", methods={"POST"}, name="smt.uploader_delete")
     */
    public function deleteAction(Request $request, Image $image)
    {
        try {
            $this->getDoctrine()->getManager()->remove($image);
            $this->getDoctrine()->getManager()->flush();
            return new JsonResponse([
                "success" => true
            ]);
        } catch(\Exception $e) {
            return new JsonResponse([
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }
    }
}