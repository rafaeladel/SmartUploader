<?php
namespace SMT\UploaderBundle\Form\Type;

use Symfony\Component\Form\AbstractType;

class SmartSingleUploaderType extends AbstractType
{
    public function getParent()
    {
        return "hidden";
    }

    public function getName()
    {
        return "smt_single_uploader";
    }
}