---
layout: post
categories: [pt-br, dotnet]
tagline: "O under-the-hood da DSL de consultas da plataforma .NET"
tags: [linq, entity framework, extension methods, intermedi&aacute;rio]
title: "LINQ - O que realmente &eacute;"
---

# Introdução

Vamos começar a primeira parte da série sobre **LINQ** falando sobre o que é a linguagem criada pela Microsoft para seleção de dados a partir de coleções.

# Origens do LINQ

O **LINQ** (**L**anguage **IN**tegrated **Q**uery -- Consulta Integrada &agrave; Linguagem) foi introduzido na plataforma .NET versão 3.5 a fim de tornar-se uma linguagem capaz de fornecer uma interface padrão para consultas a qualquer coleção, desde simples `Array`s e `List<>`s até objetos manipulados por componentes como a [Entity Framework] que podem por sua vez gerar consultas traduzidas para outras linguagens como SQL.

[Entity Framework]:http://msdn.microsoft.com/en-us/data/ef.aspx

Em outros blogs é possível ver exemplos e aprender a utilização básica dessa linguagem. O objetivo desta série é fazer com que você possa saber um pouco melhor como esse esse recurso realmente funciona e foi implementado, e portanto como utilizá-lo de maneira rápida e com segurança.

# Extension Methods

Outro novo recurso criado justamente para que fosse possível a existência do **LINQ** foram os **Extension Methods**, ou **Métodos de Extensão**, que possibilitam "adicionar" métodos a uma classe de forma transparente.

Eles atendem ao caso de uso comum de criar um médodo estático para interagir com determinada classe sem modificá-la internamente, quando muitas vezes o desejo do programador é mesmo o de modificar a classe.

{% highlight csharp %}
class MinhaClasse {
    protected int innerVar; // Invisivel para outras classes
    friend int outerVar; // Visivel para outras classes da mesma assembly
}

static class MinhaClasseExtensao {
    static method Extensao (this MinhaClasse target, int sum) {
        target.outerVar += sum;
    }
}

class TestClass {
    public static void TestMethod() {
        MinhaClasse m = new MinhaClasse();
        m.outerVar = 2;
        m.Extensao(5);
        assertEqual(m.outerVar, 7);
    }
}
{% endhighlight %}

Foi exatamente esse mesmo o cenário enfrentado pelo pessoal da .NET, eles tinham que ampliar as funcionalidades de interfaces antigas (`IEnumerable<>`, `ICollection<>`, `IList<>`, etc.) mantendo a retro-compatibilidade e sem alterar o código das implementações existentes.