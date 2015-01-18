<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Post;
use AppBundle\Form\PostType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/app/example", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $post = new Post();
        $form = $this->createForm(new PostType(), $post);

        if($request->getMethod() == "POST") {
            $form->handleRequest($request);
            if($form->isValid()) {
                $em->persist($post);
                $em->flush();
                die("saved");
            }
        }
        return $this->render('@App/index.html.twig', [
            "form" => $form->createView()
        ]);
    }
}
